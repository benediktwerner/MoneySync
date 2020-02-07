import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Account, DataService } from 'src/app/data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-account-dialog',
  templateUrl: './edit-account-dialog.component.html',
  styleUrls: ['./edit-account-dialog.component.scss'],
})
export class EditAccountDialogComponent {
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private account: Account,
    private dialogRef: MatDialogRef<EditAccountDialogComponent>,
    private data: DataService,
    formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      name: [account.name, Validators.required],
      icon: [account.icon, Validators.required],
      initialBalance: [account.initialBalance, Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.data.updateAccount({
      id: this.account.id,
      balance: this.account.balance,
      initialBalance: this.form.controls.initialBalance.value,
      name: this.form.controls.name.value,
      icon: this.form.controls.icon.value,
    });
    this.dialogRef.close(true);
  }
}
