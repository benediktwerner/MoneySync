import { Component } from '@angular/core';
import { DataService, Account } from 'src/app/data.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { AddAccountDialogComponent } from 'src/app/accounts/components/add-account-dialog/add-account-dialog.component';
import { AccountDialogComponent } from 'src/app/accounts/components/account-dialog/account-dialog.component';
import { map } from 'rxjs/operators';
import { DefaultAccountDialogComponent } from '../default-account-dialog/default-account-dialog.component';

@Component({
  selector: 'app-accounts-settings',
  templateUrl: './accounts-settings.component.html',
  styleUrls: ['./accounts-settings.component.scss'],
})
export class AccountsSettingsComponent {
  accounts: Observable<Account[]>;
  defaultAccount: Observable<string>;

  constructor(private dialog: MatDialog, data: DataService) {
    this.accounts = data.onAccountsChange;
    this.defaultAccount = data.onUserChange.pipe(map(user => user.defaultAccount));
  }

  showAccount(account: Account) {
    this.dialog.open(AccountDialogComponent, { data: account });
  }

  addAccount() {
    this.dialog.open(AddAccountDialogComponent);
  }

  selectDefaultAcc() {
    this.dialog.open(DefaultAccountDialogComponent);
  }
}
