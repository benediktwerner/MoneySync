import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountsSettingsComponent } from './settings/accounts-settings/accounts-settings.component';
import { CategoriesSettingsComponent } from './settings/categories-settings/categories-settings.component';

const routes: Routes = [
  { path: 'overview', component: OverviewComponent, pathMatch: 'full' },
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'accounts', pathMatch: 'full' },
      { path: 'accounts', component: AccountsSettingsComponent },
      { path: 'categories', component: CategoriesSettingsComponent },
    ],
  },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: '', redirectTo: '/overview', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
