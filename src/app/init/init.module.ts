import { NgModule, APP_INITIALIZER } from '@angular/core';
import { InitChartsService } from './init-charts.service';

export function initCharts(initChartsService: InitChartsService) {
  return () => initChartsService.init();
}

@NgModule({
  providers: [
    // InitChartsService,
    // { provide: APP_INITIALIZER, useFactory: initCharts, deps: [InitChartsService], multi: true },
  ],
})
export class InitModule {}
