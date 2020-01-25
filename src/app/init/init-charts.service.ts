import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';

@Injectable({
  providedIn: 'root',
})
export class InitChartsService {
  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      registerDoughnutTextPlugin();
      resolve();
    });
  }
}

interface PluginChartInstance extends Chart {
  width: number;
  height: number;
  chartArea: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
}

function registerDoughnutTextPlugin() {
  Chart.pluginService.register({
    beforeDraw: function(chart: PluginChartInstance) {
      if (chart.config.type != 'doughnut') return;

      const width = chart.chartArea.right - chart.chartArea.left;
      const height = chart.chartArea.bottom - chart.chartArea.top;
      const ctx = chart.ctx;

      ctx.save();
      const fontSize = (height / 114).toFixed(2);
      ctx.fillStyle = 'black';
      ctx.font = fontSize + 'em sans-serif';
      ctx.textBaseline = 'middle';

      const text = '75%';
      const textX = Math.round(width  - ctx.measureText(text).width) / 2 + chart.chartArea.left + 1;
      const textY = height / 2 + chart.chartArea.top;

      ctx.fillText(text, textX, textY);
      ctx.restore();
    },
  });
}
