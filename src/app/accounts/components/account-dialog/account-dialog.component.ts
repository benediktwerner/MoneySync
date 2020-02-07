import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Account, DataService } from '../../../data.service';
import { DeletionDialogComponent } from '../../../ui/deletion-dialog/deletion-dialog.component';
import { EditAccountDialogComponent } from '../edit-account-dialog/edit-account-dialog.component';
import { DeleteAccountTransactionsDialogComponent } from '../delete-account-transactions-dialog/delete-account-transactions-dialog.component';

@Component({
  selector: 'app-account-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.scss'],
})
export class AccountDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public account: Account,
    private dialogRef: MatDialogRef<AccountDialogComponent>,
    private data: DataService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  onEdit() {
    this.dialog
      .open(EditAccountDialogComponent, { data: this.account })
      .beforeClosed()
      .subscribe(result => {
        if (result) this.dialogRef.close();
      });
  }

  onDelete() {
    this.dialog
      .open(DeletionDialogComponent)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          const transactionCount = Object.values(this.data.transactions).reduce(
            (total, trans) => total + (trans.accountId == this.account.id ? 1 : 0),
            0
          );
          if (transactionCount > 0) {
            this.dialog
              .open(DeleteAccountTransactionsDialogComponent, { data: this.account })
              .afterClosed()
              .subscribe(result => {
                if (result) {
                  this.dialogRef.close();
                }
              });
          } else {
            this.dialogRef.close();
            this.data.removeAccount(this.account.id).then(null, err => {
              this.snackBar.open('Failed to delete account', 'OK', { duration: 3000 });
              console.error(err);
            });
          }
        }
      });
  }
}
