import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { DataService, Category } from 'src/app/data.service';
import { DeletionDialogComponent } from 'src/app/ui/deletion-dialog/deletion-dialog.component';
import { EditCategoryDialogComponent } from '../edit-category-dialog/edit-category-dialog.component';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss'],
})
export class CategoryDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public category: Category,
    private dialogRef: MatDialogRef<CategoryDialogComponent>,
    private data: DataService,
    private dialog: MatDialog
  ) {}

  onEdit() {
    this.dialog
      .open(EditCategoryDialogComponent, { data: this.category })
      .beforeClose()
      .subscribe(result => {
        if (result) this.dialogRef.close();
      });
  }

  onDelete() {
    this.dialog
      .open(DeletionDialogComponent)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.data.removeCategory(this.category.id);
          this.dialogRef.close();
        }
      });
  }
}
