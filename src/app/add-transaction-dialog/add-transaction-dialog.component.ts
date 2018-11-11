import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DataService, Account, Category } from '../data.service';
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
    data: DataService,
    formBuilder: FormBuilder
  ) {
    this.accounts = data.accounts;
    this.categories = data.categories;

    this.form = formBuilder.group({
      name: ['', Validators.required],
      amount: ['', Validators.required],
      account: [null, Validators.required],
      category: [null, Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.dialogRef.close({
      name: this.form.controls.name.value,
      amount: this.form.controls.amount.value,
      accountRef: this.form.controls.account.value,
      categoryRef: this.form.controls.category.value,
      timestamp: new Date(),
    });
  }
}
