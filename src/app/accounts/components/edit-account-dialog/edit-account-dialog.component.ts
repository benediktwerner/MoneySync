import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Account, DataService } from 'src/app/data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddAccountDialogComponent } from '../add-account-dialog/add-account-dialog.component';

@Component({
  selector: 'app-edit-account-dialog',
  templateUrl: './edit-account-dialog.component.html',
  styleUrls: ['./edit-account-dialog.component.scss'],
})
export class EditAccountDialogComponent {
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private account: Account,
    private dialogRef: MatDialogRef<AddAccountDialogComponent>,
    private data: DataService,
    formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      name: [account.name, Validators.required],
      icon: [account.icon, Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.data.updateAccount({
      id: this.account.id,
      balance: this.account.balance,
      name: this.form.controls.name.value,
      icon: this.form.controls.icon.value,
    });
    this.dialogRef.close(true);
  }
}
