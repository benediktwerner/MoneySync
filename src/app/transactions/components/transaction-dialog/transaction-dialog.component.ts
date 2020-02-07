import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Transaction, DataService, Category, Account } from '../../../data.service';
import { DeletionDialogComponent } from '../../../ui/deletion-dialog/deletion-dialog.component';
import { EditTransactionDialogComponent } from '../edit-transaction-dialog/edit-transaction-dialog.component';

@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './transaction-dialog.component.html',
  styleUrls: ['./transaction-dialog.component.scss'],
})
export class TransactionDialogComponent {
  account: Account;
  category: Category;

  constructor(
    @Inject(MAT_DIALOG_DATA) public transaction: Transaction,
    private dialogRef: MatDialogRef<TransactionDialogComponent>,
    private data: DataService,
    private dialog: MatDialog
  ) {
    this.account = data.accounts[transaction.accountId];
    this.category = data.categories[transaction.categoryId];
  }

  onEdit() {
    this.dialog
      .open(EditTransactionDialogComponent, { data: this.transaction })
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
          this.dialogRef.close();
          this.data.removeTransaction(this.transaction.id);
        }
      });
  }
}
