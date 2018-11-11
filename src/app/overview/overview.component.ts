import { Component } from '@angular/core';
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs';
import { DataService, Account, Transaction } from '../data.service';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { TransactionDialogComponent } from '../transaction-dialog/transaction-dialog.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  accounts: Observable<Account[]>;
  transactions: Observable<{ key: string; elements: Transaction[] }[]>;

  totalBalance: Observable<number>;
  currentMonthTotal: Observable<number>;
  lastMonthTotal: Observable<number>;

  constructor(private dialog: MatDialog, data: DataService) {
    this.accounts = data.accounts;
    this.transactions = data.transactions.pipe(
      map(arr => {
        let groups = {};
        let result = [];

        for (let trans of arr.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10)) {
          let key = this.daysAgo(trans.date);
          if (!groups[key]) {
            let newGroup = [trans];
            groups[key] = newGroup;
            result.push({
              key: key,
              elements: newGroup,
            });
          } else groups[key].push(trans);
        }

        return result;
      })
    );

    this.totalBalance = data.totalBalance;
    this.currentMonthTotal = data.currentMonthTotal;
    this.lastMonthTotal = data.lastMonthTotal;
  }

  showTransaction(transaction) {
    this.dialog.open(TransactionDialogComponent, {
      data: transaction,
    });
  }

  private daysAgo(date: Date) {
    let diff = Math.floor((new Date().getTime() - date.getTime()) / 1000 / 60 / 60 / 24);
    if (diff < 0) return 'In the future';
    if (diff == 0) return 'Today';
    if (diff <= 3) return `${diff} days ago`;
    return formatDate(date, 'dd. MMM yyyy', 'en');
  }
}
