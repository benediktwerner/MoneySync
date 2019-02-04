import { Component, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { DataService, Dict } from 'src/app/data.service';
import { Subscription } from 'rxjs';
import { Chart, ChartOptions } from 'chart.js';

const CHART_OPTIONS: ChartOptions = {
  tooltips: {
    callbacks: {
      label: function(tooltipItem, data) {
        const label = data.labels[tooltipItem.index] + ': ';
        return label + data.datasets[0].data[tooltipItem.index] + '€';
      },
    },
  },
};

@Component({
  selector: 'app-earnings-spendings-statistics',
  templateUrl: './earnings-spendings-statistics.component.html',
  styleUrls: ['./earnings-spendings-statistics.component.scss'],
})
export class EarningsSpendingsStatisticsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('earningsChart') private earningsChartRef: ElementRef<HTMLCanvasElement>;
  @ViewChild('spendingsChart') private spendingsChartRef: ElementRef<HTMLCanvasElement>;

  private earningsChart: Chart;
  private spendingsChart: Chart;
  private earnings: Dict<number> = {};
  private spendings: Dict<number> = {};
  private subscription: Subscription;

  constructor(public data: DataService) {
    this.subscription = data.onTransactionsChange.subscribe(transactions => {
      let catTotal = {};

      for (const trans of transactions) {
        if (trans.categoryId in catTotal) catTotal[trans.categoryId] += trans.amount;
        else catTotal[trans.categoryId] = trans.amount;
      }

      this.earnings = {};
      this.spendings = {};

      for (const catId in catTotal) {
        if (catTotal[catId] > 0) this.earnings[catId] = round(catTotal[catId]);
        else this.spendings[catId] = round(catTotal[catId]);
      }

      if (this.earningsChart) {
        this.earningsChart.data.labels = Object.keys(this.earnings).map(catId => this.data.categories[catId].name);
        this.earningsChart.data.datasets[0].data = Object.values(this.earnings);
        this.earningsChart.data.datasets[0].backgroundColor = genreateColors(Object.keys(this.earnings).length);
        this.earningsChart.update();
      }
      if (this.spendingsChart) {
        this.spendingsChart.data.labels = Object.keys(this.spendings).map(catId => this.data.categories[catId].name);
        this.spendingsChart.data.datasets[0].data = Object.values(this.spendings);
        this.spendingsChart.data.datasets[0].backgroundColor = genreateColors(Object.keys(this.spendings).length);
        this.spendingsChart.update();
      }
    });
  }

  ngAfterViewInit() {
    this.earningsChart = new Chart(this.earningsChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: Object.values(this.earnings),
            backgroundColor: genreateColors(Object.keys(this.earnings).length),
          },
        ],
        labels: Object.keys(this.earnings).map(catId => this.data.categories[catId].name),
      },
      options: CHART_OPTIONS,
    });

    this.spendingsChart = new Chart(this.spendingsChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: Object.values(this.spendings),
            backgroundColor: genreateColors(Object.keys(this.earnings).length),
          },
        ],
        labels: Object.keys(this.spendings).map(catId => this.data.categories[catId].name),
      },
      options: CHART_OPTIONS,
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

function round(number: number) {
  return +number.toFixed(2);
}

function genreateColors(length: number) {
  let result = [];
  for (let i = 0; i < length; i++) {
    const hue = (360 * i) / length;
    result.push(`hsl(${hue}, 60%, 60%)`);
  }
  return result;
}
