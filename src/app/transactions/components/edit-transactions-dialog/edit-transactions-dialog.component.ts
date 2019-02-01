import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Account, Category, TransactionPlain, DataService, Transaction } from 'src/app/data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddTransactionDialogComponent } from '../add-transaction-dialog/add-transaction-dialog.component';

@Component({
  selector: 'app-edit-transactions-dialog',
  templateUrl: './edit-transactions-dialog.component.html',
  styleUrls: ['./edit-transactions-dialog.component.scss'],
})
export class EditTransactionsDialogComponent {
  form: FormGroup;

  accounts: Observable<Account[]>;
  categories: Observable<Category[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private transaction: Transaction,
    private dialogRef: MatDialogRef<AddTransactionDialogComponent, TransactionPlain>,
    private data: DataService,
    formBuilder: FormBuilder
  ) {
    this.accounts = data.accounts;
    this.categories = data.categories;

    this.form = formBuilder.group({
      name: [transaction.name, Validators.required],
      amount: [transaction.amount, Validators.required],
      account: [transaction.accountId, Validators.required],
      category: [transaction.categoryId, Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.data.updateTransaction({
      id: this.transaction.id,
      name: this.form.controls.name.value,
      amount: this.form.controls.amount.value,
      accountId: this.form.controls.account.value,
      categoryId: this.form.controls.category.value,
      timestamp: this.transaction.timestamp,
    });
    this.dialogRef.close();
  }
}
