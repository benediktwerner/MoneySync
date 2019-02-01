import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { AddTransactionDialogComponent } from './components/add-transaction-dialog/add-transaction-dialog.component';
import { TransactionDialogComponent } from './components/transaction-dialog/transaction-dialog.component';
import { TransactionsComponent } from './transactions.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DeletionDialogModule } from '../ui/deletion-dialog/deletion-dialog.module';
import { CurrencyModule } from '../ui/currency/currency.module';

@NgModule({
  declarations: [TransactionsComponent, AddTransactionDialogComponent, TransactionDialogComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, DeletionDialogModule, CurrencyModule],
  exports: [TransactionsComponent, AddTransactionDialogComponent, TransactionDialogComponent],
  entryComponents: [AddTransactionDialogComponent, TransactionDialogComponent],
})
export class TransactionsModule {}
