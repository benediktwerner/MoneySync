import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { OverviewComponent } from './overview.component';
import { CurrencyModule } from '../ui/currency/currency.module';
import { StatisticsModule } from '../statistics/statistics.module';

@NgModule({
  declarations: [OverviewComponent],
  imports: [CommonModule, MaterialModule, CurrencyModule, StatisticsModule],
  exports: [OverviewComponent],
})
export class OverviewModule {}
