import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Account, Category, DataService, Transaction } from 'src/app/data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddTransactionDialogComponent } from '../add-transaction-dialog/add-transaction-dialog.component';

@Component({
  selector: 'app-edit-transaction-dialog',
  templateUrl: './edit-transaction-dialog.component.html',
  styleUrls: ['./edit-transaction-dialog.component.scss'],
})
export class EditTransactionDialogComponent {
  form: FormGroup;

  accounts: Account[];
  categories: Category[];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private transaction: Transaction,
    private dialogRef: MatDialogRef<AddTransactionDialogComponent>,
    private data: DataService,
    formBuilder: FormBuilder
  ) {
    this.accounts = Object.values(data.accounts);
    this.categories = Object.values(data.categories);

    this.form = formBuilder.group({
      name: [transaction.name, Validators.required],
      date: [transaction.date, Validators.required],
      amount: [transaction.amount, Validators.required],
      account: [transaction.accountId, Validators.required],
      category: [transaction.categoryId],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.data.updateTransaction({
      id: this.transaction.id,
      name: this.form.controls.name.value,
      date: this.form.controls.date.value,
      amount: this.form.controls.amount.value,
      accountId: this.form.controls.account.value,
      categoryId: this.form.controls.category.value,
    });
    this.dialogRef.close(true);
  }
}
