import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService, Category } from 'src/app/data.service';

@Component({
  selector: 'app-edit-category-dialog',
  templateUrl: './edit-category-dialog.component.html',
  styleUrls: ['./edit-category-dialog.component.scss'],
})
export class EditCategoryDialogComponent {
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private category: Category,
    private dialogRef: MatDialogRef<EditCategoryDialogComponent>,
    private data: DataService,
    formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      name: [category.name, Validators.required],
      icon: [category.icon, Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.data.updateCategory({
      id: this.category.id,
      name: this.form.controls.name.value,
      icon: this.form.controls.icon.value,
    });
    this.dialogRef.close(true);
  }
}
