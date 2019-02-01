import { Component } from '@angular/core';
import { DataService, Category } from 'src/app/data.service';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { AddCategoryDialogComponent } from '../add-category-dialog/add-category-dialog.component';

@Component({
  selector: 'app-categories-settings',
  templateUrl: './categories-settings.component.html',
  styleUrls: ['./categories-settings.component.scss'],
})
export class CategoriesSettingsComponent {
  categories: Observable<Category[]>;

  constructor(private dialog: MatDialog, data: DataService) {
    this.categories = data.onCategoriesChange;
  }

  showCategory(category: Category) {
    this.dialog.open(CategoryDialogComponent, { data: category });
  }

  addCategory() {
    this.dialog.open(AddCategoryDialogComponent);
  }
}
