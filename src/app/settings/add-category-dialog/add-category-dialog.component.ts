import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.component.scss'],
})
export class AddCategoryDialogComponent {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    private data: DataService,
    formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.data.addCategory({
      id: null,
      name: this.form.controls.name.value,
      icon: this.form.controls.icon.value,
    });
    this.dialogRef.close();
  }
}
