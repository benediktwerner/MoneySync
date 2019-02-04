import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountsSettingsComponent } from './settings/accounts-settings/accounts-settings.component';
import { CategoriesSettingsComponent } from './settings/categories-settings/categories-settings.component';
import { ChartSettingsComponent } from './settings/chart-settings/chart-settings.component';
import { AccountsStatisticsComponent } from './statistics/accounts-statistics/accounts-statistics.component';
import { CategoriesStatisticsComponent } from './statistics/categories-statistics/categories-statistics.component';
import { EarningsSpendingsStatisticsComponent } from './statistics/earnings-spendings-statistics/earnings-spendings-statistics.component';

const routes: Routes = [
  { path: '', redirectTo: '/overview', pathMatch: 'full' },
  { path: 'overview', component: OverviewComponent, pathMatch: 'full' },
  { path: 'transactions', component: TransactionsComponent },
  {
    path: 'statistics',
    component: StatisticsComponent,
    children: [
      { path: '', redirectTo: 'accounts', pathMatch: 'full' },
      { path: 'accounts', component: AccountsStatisticsComponent },
      { path: 'categories', component: CategoriesStatisticsComponent },
      { path: 'earnings-spendings', component: EarningsSpendingsStatisticsComponent },
    ],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'accounts', pathMatch: 'full' },
      { path: 'accounts', component: AccountsSettingsComponent },
      { path: 'categories', component: CategoriesSettingsComponent },
      { path: 'charts', component: ChartSettingsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
