import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { AddTransactionDialogComponent } from './components/add-transaction-dialog/add-transaction-dialog.component';
import { TransactionDialogComponent } from './components/transaction-dialog/transaction-dialog.component';
import { TransactionsComponent } from './transactions.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DeletionDialogModule } from '../ui/deletion-dialog/deletion-dialog.module';
import { CurrencyModule } from '../ui/currency/currency.module';
import { EditTransactionsDialogComponent } from './components/edit-transactions-dialog/edit-transactions-dialog.component';

@NgModule({
  declarations: [
    TransactionsComponent,
    AddTransactionDialogComponent,
    TransactionDialogComponent,
    EditTransactionsDialogComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, DeletionDialogModule, CurrencyModule],
  exports: [TransactionsComponent, AddTransactionDialogComponent, TransactionDialogComponent],
  entryComponents: [AddTransactionDialogComponent, EditTransactionsDialogComponent, TransactionDialogComponent],
})
export class TransactionsModule {}
