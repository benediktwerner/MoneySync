import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Account, DataService } from '../data.service';
import { MatDialog } from '@angular/material';
import { AccountDialogComponent } from '../accounts/components/account-dialog/account-dialog.component';
import { AddAccountDialogComponent } from '../accounts/components/add-account-dialog/add-account-dialog.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  accounts: Observable<Account[]>;

  constructor(private dialog: MatDialog, public data: DataService) {
    this.accounts = data.onAccountsChange;
  }

  showAccount(account: Account) {
    this.dialog.open(AccountDialogComponent, { data: account });
  }

  addAccount() {
    this.dialog.open(AddAccountDialogComponent);
  }
}
