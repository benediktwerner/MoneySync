import { Component } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { MatSlideToggleChange, MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-chart-settings',
  templateUrl: './chart-settings.component.html',
  styleUrls: ['./chart-settings.component.scss'],
})
export class ChartSettingsComponent {
  constructor(public data: DataService) {}

  startAtZeroChanged(event: MatSlideToggleChange) {
    this.data.user.chartsStartAtZero = event.checked;
    this.data.updateUserSettings();
  }

  fillChanged(event: MatSelectChange) {
    console.log(event);
    this.data.user.chartsFill = event.value;
    this.data.updateUserSettings();
  }
}
