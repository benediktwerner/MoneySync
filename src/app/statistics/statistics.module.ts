import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsComponent } from './statistics.component';
import { TotalChartComponent } from './total-chart/total-chart.component';

@NgModule({
  declarations: [StatisticsComponent, TotalChartComponent],
  imports: [CommonModule],
  exports: [StatisticsComponent, TotalChartComponent],
})
export class StatisticsModule {}
