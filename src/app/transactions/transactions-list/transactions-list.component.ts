import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { DataService, Transaction } from 'src/app/data.service';
import { Subscription } from 'rxjs';
import { KeyValue, formatDate } from '@angular/common';
import { MatDialog } from '@angular/material';
import { TransactionDialogComponent } from '../components/transaction-dialog/transaction-dialog.component';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss'],
})
export class TransactionsListComponent implements OnChanges, OnDestroy {
  @Input() private maxCount: number = 20;
  @Input() private showEarnings: boolean = true;
  @Input() private showSpendings: boolean = true;
  @Input() private accountFilter: string = '';
  @Input() private categoryFilter: string = '';
  @Input() private nameFilter: string = '';
  @Input() private minAmount: number;
  @Input() private maxAmount: number;

  transactionsByDate: KeyValue<string, Transaction>[];
  private subscription: Subscription;

  constructor(private dialog: MatDialog, private data: DataService) {
    this.subscription = this.data.onTransactionsChange.subscribe(this.setValuesFromTransactions.bind(this));
  }

  private setValuesFromTransactions(transactions: Transaction[]) {
    let groups = {};
    let result = [];
    const transactionsSorted = transactions.sort((a, b) => b.date.getTime() - a.date.getTime());

    for (let trans of transactionsSorted.slice(0, this.maxCount)) {
      if (!this.showEarnings && trans.amount > 0) continue;
      if (!this.showSpendings && trans.amount < 0) continue;
      if (this.categoryFilter && trans.categoryId != this.categoryFilter) continue;
      if (this.accountFilter && trans.accountId != this.accountFilter) continue;
      if (this.nameFilter && trans.name.toLowerCase().indexOf(this.nameFilter.toLowerCase()) == -1) continue;
      if (this.minAmount && Math.abs(trans.amount) < this.minAmount) continue;
      if (this.maxAmount && Math.abs(trans.amount) > this.maxAmount) continue;

      const key = daysAgo(trans.date);

      if (key in groups) {
        groups[key].value.push(trans);
      } else {
        groups[key] = { key, value: [trans] };
        result.push(groups[key]);
      }
    }

    this.transactionsByDate = result;
  }

  ngOnChanges() {
    this.setValuesFromTransactions(Object.values(this.data.transactions));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showTransaction(transaction: Transaction) {
    this.dialog.open(TransactionDialogComponent, { data: transaction });
  }
}

function daysAgo(date: Date) {
  let diff = Math.floor((new Date().getTime() - date.getTime()) / 1000 / 60 / 60 / 24);
  if (diff < 0) return 'In the future';
  if (diff == 0) return 'Today';
  if (diff == 1) return 'Yesterday';
  if (diff <= 5) return `${diff} days ago`;
  return formatDate(date, 'dd. MMMM yyyy', 'en');
}
