import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { OverviewComponent } from './overview/overview.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { BalanceComponent } from './balance/balance.component';
import { AddTransactionDialogComponent } from './add-transaction-dialog/add-transaction-dialog.component';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    TransactionsComponent,
    StatisticsComponent,
    BalanceComponent,
    AddTransactionDialogComponent,
    TransactionDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  entryComponents: [AddTransactionDialogComponent, TransactionDialogComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
