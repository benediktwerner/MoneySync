import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { AccountsComponent } from './accounts/accounts.component';

const routes: Routes = [
  { path: 'overview', component: OverviewComponent, pathMatch: 'full' },
  { path: 'accounts', component: AccountsComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: '', redirectTo: '/overview', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
