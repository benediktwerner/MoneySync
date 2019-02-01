import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { OverviewComponent } from './overview.component';
import { CurrencyModule } from '../ui/currency/currency.module';

@NgModule({
  declarations: [OverviewComponent],
  imports: [CommonModule, MaterialModule, CurrencyModule],
  exports: [OverviewComponent],
})
export class OverviewModule {}
