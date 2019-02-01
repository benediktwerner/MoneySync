import { Component, OnInit, OnDestroy } from '@angular/core';
import { formatDate, KeyValue } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { DataService, Account, Transaction } from '../data.service';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { TransactionDialogComponent } from '../transactions/components/transaction-dialog/transaction-dialog.component';
import { Chart } from 'chart.js';
import { AccountDialogComponent } from '../accounts/components/account-dialog/account-dialog.component';
import { AddAccountDialogComponent } from '../accounts/components/add-account-dialog/add-account-dialog.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit, OnDestroy {
  accounts: Observable<Account[]>;
  transactionsByDate: Observable<KeyValue<string, Transaction>[]>;

  private chart: any;
  private chartData: { t: number; y: number }[];
  private subscription: Subscription;

  constructor(private dialog: MatDialog, public data: DataService) {
    this.accounts = this.data.onAccountsChange;
    this.transactionsByDate = this.data.onTransactionsChange.pipe(
      map(trans => {
        let groups = {};
        let result = [];
        const transactionsSorted = trans.sort((a, b) => b.date.getTime() - a.date.getTime());

        for (let trans of transactionsSorted.slice(0, 10)) {
          let key = daysAgo(trans.date);
          if (key in groups) {
            groups[key].value.push(trans);
          } else {
            groups[key] = { key, value: [trans] };
            result.push(groups[key]);
          }
        }

        return result;
      })
    );

    this.subscription = this.data.onTransactionsChange.subscribe(transactions => {
      let data = [];
      let total = 0;

      for (const trans of transactions.sort((a, b) => a.date.getTime() - b.date.getTime())) {
        total = round(total + trans.amount);
        data.push({
          t: trans.date,
          y: total,
        });
      }
      data.push({
        t: new Date(),
        y: total,
      });

      this.chartData = data;
      if (this.chart) {
        this.chart.data.datasets[0].data = data;
        this.chart.update();
      }
    });
  }

  ngOnInit() {
    this.createChart();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createChart() {
    if (this.chart) return;
    this.chart = new Chart(document.getElementById('chart'), {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Total',
            fill: false,
            steppedLine: true,
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            data: this.chartData || [],
          },
        ],
      },
      options: {
        responsive: true,
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          xAxes: [
            {
              type: 'time',
            },
          ],
        },
      },
    });
  }

  showTransaction(transaction: Transaction) {
    this.dialog.open(TransactionDialogComponent, { data: transaction });
  }

  showAccount(account: Account) {
    this.dialog.open(AccountDialogComponent, { data: account });
  }

  addAccount() {
    this.dialog.open(AddAccountDialogComponent);
  }
}

function daysAgo(date: Date) {
  let diff = Math.floor((new Date().getTime() - date.getTime()) / 1000 / 60 / 60 / 24);
  if (diff < 0) return 'In the future';
  if (diff == 0) return 'Today';
  if (diff == 1) return 'Yesterday';
  if (diff <= 5) return `${diff} days ago`;
  return formatDate(date, 'dd. MMM yyyy', 'en');
}

function round(number: number) {
  return +number.toFixed(2);
}
