import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { AddAccountDialogComponent } from './components/add-account-dialog/add-account-dialog.component';
import { AccountDialogComponent } from './components/account-dialog/account-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DeletionDialogModule } from '../ui/deletion-dialog/deletion-dialog.module';
import { CurrencyModule } from '../ui/currency/currency.module';
import { EditAccountDialogComponent } from './components/edit-account-dialog/edit-account-dialog.component';
import { DeleteAccountTransactionsDialogComponent } from './components/delete-account-transactions-dialog/delete-account-transactions-dialog.component';
import { IconSelectorModule } from '../ui/icon-selector/icon-selector.module';

@NgModule({
  declarations: [
    AddAccountDialogComponent,
    AccountDialogComponent,
    EditAccountDialogComponent,
    DeleteAccountTransactionsDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DeletionDialogModule,
    CurrencyModule,
    IconSelectorModule,
  ],
  exports: [AddAccountDialogComponent, AccountDialogComponent],
  entryComponents: [
    AddAccountDialogComponent,
    EditAccountDialogComponent,
    AccountDialogComponent,
    DeleteAccountTransactionsDialogComponent,
  ],
})
export class AccountsModule {}
