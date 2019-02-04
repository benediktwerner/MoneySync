import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsComponent } from './statistics.component';
import { TotalChartComponent } from './components/total-chart/total-chart.component';
import { MaterialModule } from '../material.module';
import { AppRoutingModule } from '../app-routing.module';
import { AccountsStatisticsComponent } from './accounts-statistics/accounts-statistics.component';
import { CategoriesStatisticsComponent } from './categories-statistics/categories-statistics.component';
import { EarningsSpendingsStatisticsComponent } from './earnings-spendings-statistics/earnings-spendings-statistics.component';
import { CurrencyModule } from '../ui/currency/currency.module';

@NgModule({
  declarations: [
    StatisticsComponent,
    TotalChartComponent,
    AccountsStatisticsComponent,
    CategoriesStatisticsComponent,
    EarningsSpendingsStatisticsComponent,
  ],
  imports: [CommonModule, MaterialModule, AppRoutingModule, CurrencyModule],
  exports: [
    StatisticsComponent,
    TotalChartComponent,
    AccountsStatisticsComponent,
    CategoriesStatisticsComponent,
    EarningsSpendingsStatisticsComponent,
  ],
})
export class StatisticsModule {}
