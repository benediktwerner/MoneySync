import { Component, ViewChild, ElementRef } from '@angular/core';
import { DataService, Transaction, Dict } from 'src/app/data.service';
import { Chart, ChartPoint, ChartDataSets } from 'chart.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories-statistics',
  templateUrl: './categories-statistics.component.html',
  styleUrls: ['./categories-statistics.component.scss'],
})
export class CategoriesStatisticsComponent {
  @ViewChild('chart') private chartRef: ElementRef<HTMLCanvasElement>;
  private chart: Chart;
  private chartData: ChartDataSets[] = [];
  private subscription: Subscription;
  public categoryTotals: Dict<number> = {};

  constructor(public data: DataService) {
    this.generateData = this.generateData.bind(this);
    this.subscription = data.onTransactionsChange.subscribe(this.generateData);
  }

  generateData(transactions: Transaction[]) {
    if (transactions.length == 0) return;

    const today = new Date();
    let firstMonth = today.getFullYear() * 12 + today.getMonth() - 11;
    let months: Transaction[][] = [];
    for (let i = 0; i < 12; i++) months.push([]);

    for (const trans of transactions) {
      const month = trans.date.getMonth() + trans.date.getFullYear() * 12;
      if (month < firstMonth) continue;
      months[month - firstMonth].push(trans);
    }

    let catData = {};
    this.categoryTotals = {};

    for (const catId in this.data.categories) {
      catData[catId] = [];
      this.categoryTotals[catId] = 0;
    }

    for (let month = 0; month < 12; month++) {
      let catTotal = {};

      for (const trans of months[month]) {
        catTotal[trans.categoryId] = (catTotal[trans.categoryId] || 0) + trans.amount;
      }

      const date = new Date(today.getFullYear(), today.getMonth() - 11 + month);
      let lastSpending = 0;
      let lastIncome = 0;

      for (let catId in catData) {
        const value = round(catTotal[catId] || 0);
        this.categoryTotals[catId] += value;

        if (value < 0) {
          lastSpending = value + lastSpending;
          catData[catId].push({ t: date, y: lastSpending, r: value });
        } else {
          lastIncome = value + lastIncome;
          catData[catId].push({ t: date, y: lastIncome, r: value });
        }
      }
    }

    let index = 0;
    this.chartData = [];
    for (let catId in catData) {
      this.chartData.push(
        this.generateDataset(this.data.categories[catId].name, catData[catId], index++)
      );
    }

    if (this.chart) {
      this.chart.data.datasets = this.chartData;
      this.chart.update();
    }
  }

  generateDataset(label: string, data: ChartPoint[], index: number): Chart.ChartDataSets {
    const length = Object.keys(this.data.categories).length;
    const hue = (360 * index) / length;
    const color = `hsl(${hue}, 60%, 60%)`;
    return {
      label,
      data,
      fill: 'origin',
      backgroundColor: color,
      borderColor: 'transparent',
      cubicInterpolationMode: 'monotone',
      pointRadius: 0,
    };
  }

  ngAfterViewInit() {
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        datasets: this.chartData,
      },
      options: {
        tooltips: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(tooltipItem, data) {
              let label = data.datasets[tooltipItem.datasetIndex].label + ': ';
              let point = data.datasets[tooltipItem.datasetIndex].data[
                tooltipItem.index
              ] as ChartPoint;
              return label + point.r + '€';
            },
          },
        },
        scales: {
          yAxes: [
            {
              ticks: {
                callback: function(value, index, values) {
                  return value + '€';
                },
                beginAtZero: this.data.user.chartsStartAtZero,
              },
            },
          ],
          xAxes: [
            {
              type: 'time',
              time: {
                round: 'month',
                minUnit: 'month',
              },
            },
          ],
        },
      },
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

function round(number: number) {
  return +number.toFixed(2);
}
