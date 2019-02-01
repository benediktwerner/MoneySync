import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Transaction, DataService } from '../../../data.service';
import { DeletionDialogComponent } from '../../../ui/deletion-dialog/deletion-dialog.component';
import { EditTransactionsDialogComponent } from '../edit-transactions-dialog/edit-transactions-dialog.component';

@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './transaction-dialog.component.html',
  styleUrls: ['./transaction-dialog.component.scss'],
})
export class TransactionDialogComponent {
  isEditing: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public transaction: Transaction,
    private dialogRef: MatDialogRef<TransactionDialogComponent>,
    private data: DataService,
    private dialog: MatDialog
  ) {}

  onEdit() {
    this.dialogRef.close();
    this.dialog.open(EditTransactionsDialogComponent, { data: this.transaction });
  }

  onDelete() {
    this.dialog
      .open(DeletionDialogComponent)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.dialogRef.close();
          this.data.removeTransaction(this.transaction);
        }
      });
  }
}
