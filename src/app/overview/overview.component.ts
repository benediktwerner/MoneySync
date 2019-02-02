import { Component } from '@angular/core';
import { formatDate, KeyValue } from '@angular/common';
import { Observable } from 'rxjs';
import { DataService, Account, Transaction } from '../data.service';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { TransactionDialogComponent } from '../transactions/components/transaction-dialog/transaction-dialog.component';
import { AccountDialogComponent } from '../accounts/components/account-dialog/account-dialog.component';
import { AddAccountDialogComponent } from '../accounts/components/add-account-dialog/add-account-dialog.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  accounts: Observable<Account[]>;
  transactionsByDate: Observable<KeyValue<string, Transaction>[]>;

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
