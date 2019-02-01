import { Component } from '@angular/core';
import { DataService, Account } from 'src/app/data.service';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-default-account-dialog',
  templateUrl: './default-account-dialog.component.html',
  styleUrls: ['./default-account-dialog.component.scss'],
})
export class DefaultAccountDialogComponent {
  form: FormGroup;
  accounts: Account[];

  constructor(
    private data: DataService,
    private dialogRef: MatDialogRef<DefaultAccountDialogComponent>,
    formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      defaultAccount: [data.user.defaultAccount, Validators.required],
    });
    this.accounts = Object.values(data.accounts);
  }

  onSubmit() {
    this.data.setDefaultAccount(this.form.controls.defaultAccount.value);
    this.dialogRef.close();
  }
}
