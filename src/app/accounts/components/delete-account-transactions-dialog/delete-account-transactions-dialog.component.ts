import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { DataService, Account } from 'src/app/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export enum Action {
  Delete,
  Move,
}

@Component({
  selector: 'app-delete-account-transactions-dialog',
  templateUrl: './delete-account-transactions-dialog.component.html',
  styleUrls: ['./delete-account-transactions-dialog.component.scss'],
})
export class DeleteAccountTransactionsDialogComponent {
  transactionCount: number;
  accounts: Account[];
  form: FormGroup;
  action: Action = Action.Delete;

  ActionEnum = Action;

  constructor(
    @Inject(MAT_DIALOG_DATA) public account: Account,
    private dialogRef: MatDialogRef<DeleteAccountTransactionsDialogComponent>,
    private snackBar: MatSnackBar,
    private data: DataService,
    formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      targetAccount: ['', Validators.required],
    });

    this.transactionCount = Object.values(this.data.transactions).reduce(
      (total, trans) => total + (trans.accountId == this.account.id ? 1 : 0),
      0
    );

    this.accounts = Object.values(data.accounts).filter(acc => acc.id != account.id);
  }

  onSubmit() {
    if (this.action == Action.Move && this.form.invalid) return;

    this.data
      .removeAccount(this.account.id, this.action == Action.Move, this.form.controls.targetAccount.value)
      .then(null, err => {
        this.snackBar.open('Failed to delete account', 'OK', { duration: 3000 });
        console.error(err);
      });

    this.dialogRef.close(true);
  }
}
