import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { AccountsSettingsComponent } from './accounts-settings/accounts-settings.component';
import { CategoriesSettingsComponent } from './categories-settings/categories-settings.component';
import { AppRoutingModule } from '../app-routing.module';
import { MaterialModule } from '../material.module';
import { CurrencyModule } from '../ui/currency/currency.module';
import { IconSelectorModule } from '../ui/icon-selector/icon-selector.module';
import { DefaultAccountDialogComponent } from './default-account-dialog/default-account-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { EditCategoryDialogComponent } from './edit-category-dialog/edit-category-dialog.component';
import { DeletionDialogModule } from '../ui/deletion-dialog/deletion-dialog.module';

@NgModule({
  declarations: [
    SettingsComponent,
    AccountsSettingsComponent,
    CategoriesSettingsComponent,
    DefaultAccountDialogComponent,
    AddCategoryDialogComponent,
    CategoryDialogComponent,
    EditCategoryDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    CurrencyModule,
    IconSelectorModule,
    DeletionDialogModule,
  ],
  exports: [SettingsComponent, AccountsSettingsComponent, CategoriesSettingsComponent],
  entryComponents: [
    DefaultAccountDialogComponent,
    AddCategoryDialogComponent,
    EditCategoryDialogComponent,
    CategoryDialogComponent,
  ],
})
export class SettingsModule {}
