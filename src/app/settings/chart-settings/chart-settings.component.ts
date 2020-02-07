import { Component } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSelectChange } from '@angular/material/select';

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
    this.data.user.chartsFill = event.value;
    this.data.updateUserSettings();
  }

  lineStyleChanged(event: MatSelectChange) {
    this.data.user.chartsLineStyle = event.value;
    this.data.updateUserSettings();
  }
}
