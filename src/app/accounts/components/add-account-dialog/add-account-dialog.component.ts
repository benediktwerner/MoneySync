import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DataService } from '../../../data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-account-dialog',
  templateUrl: './add-account-dialog.component.html',
  styleUrls: ['./add-account-dialog.component.scss'],
})
export class AddAccountDialogComponent {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddAccountDialogComponent>,
    private data: DataService,
    formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      initialBalance: [0, Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.data.addAccount({
      id: null,
      balance: 0,
      initialBalance: this.form.controls.initialBalance.value,
      name: this.form.controls.name.value,
      icon: this.form.controls.icon.value,
    });
    this.dialogRef.close();
  }
}
