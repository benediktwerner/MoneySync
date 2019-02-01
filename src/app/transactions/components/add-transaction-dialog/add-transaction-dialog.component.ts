import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DataService, Account, Category } from '../../../data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-transaction-dialog',
  templateUrl: './add-transaction-dialog.component.html',
  styleUrls: ['./add-transaction-dialog.component.scss'],
})
export class AddTransactionDialogComponent {
  form: FormGroup;

  accounts: Account[];
  categories: Category[];

  constructor(
    private dialogRef: MatDialogRef<AddTransactionDialogComponent>,
    private data: DataService,
    formBuilder: FormBuilder
  ) {
    this.accounts = Object.values(data.accounts);
    this.categories = Object.values(data.categories);

    this.form = formBuilder.group({
      name: ['', Validators.required],
      amount: ['', Validators.required],
      account: [data.user.defaultAccount, Validators.required],
      category: [''],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.data.addTransaction({
      id: null,
      name: this.form.controls.name.value,
      amount: this.form.controls.amount.value,
      accountId: this.form.controls.account.value,
      categoryId: this.form.controls.category.value,
      date: new Date(),
    });
    this.dialogRef.close();
  }
}
