import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DataService, Account, Category } from '../../../data.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-transaction-dialog',
  templateUrl: './add-transaction-dialog.component.html',
  styleUrls: ['./add-transaction-dialog.component.scss'],
})
export class AddTransactionDialogComponent {
  form: FormGroup;

  accounts: Observable<Account[]>;
  categories: Observable<Category[]>;

  constructor(
    private dialogRef: MatDialogRef<AddTransactionDialogComponent>,
    private data: DataService,
    formBuilder: FormBuilder
  ) {
    this.accounts = data.accounts;
    this.categories = data.categories;

    this.form = formBuilder.group({
      name: ['', Validators.required],
      amount: ['', Validators.required],
      account: ['', Validators.required],
      category: ['', Validators.required],
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
      timestamp: new Date(),
    });
    this.dialogRef.close();
  }
}
