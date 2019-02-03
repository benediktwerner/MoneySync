import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import { DataService, Transaction, Dict } from 'src/app/data.service';
import { Subscription } from 'rxjs';

interface ChartDataPoint {
  t: number;
  y: number;
}

@Component({
  selector: 'app-total-chart',
  templateUrl: './total-chart.component.html',
  styleUrls: ['./total-chart.component.scss'],
})
export class TotalChartComponent implements OnDestroy, AfterViewInit {
  @ViewChild('chart') private chartRef: ElementRef<HTMLCanvasElement>;
  private chart: Chart;
  private chartData: Chart.ChartDataSets[] = [];
  private subscription: Subscription;

  constructor(private data: DataService) {
    this.generateData = this.generateData.bind(this);
    this.subscription = data.onAccountsChange.subscribe(this.generateData);

    this.subscription.add(
      data.onUserChange.subscribe(user => {
        for (let dataset of this.chartData) {
          dataset.fill = user.chartsFill;
          dataset.steppedLine = data.user.chartsLineStyle == 'stepped';
          dataset.lineTension = this.data.user.chartsLineStyle == 'round' ? 0.4 : 0;
        }
        if (this.chart) {
          this.chart.config.options.scales.yAxes[0].ticks.beginAtZero = user.chartsStartAtZero;
          this.chart.update();
        }
      })
    );
  }

  generateData() {
    const transactionsList = Object.values(this.data.transactions);
    const accountsList = Object.values(this.data.accounts);

    if (transactionsList.length == 0 || accountsList.length == 0) return;

    let days: Dict<Transaction[]> = {};
    for (const trans of transactionsList.sort((a, b) => a.date.getTime() - b.date.getTime())) {
      const date = trans.date.toLocaleDateString();
      if (date in days) days[date].push(trans);
      else days[date] = [trans];
    }

    let totalData = [];
    let totalAmount = 0;
    let accData = {};
    let accTotal = {};

    for (const accId in this.data.accounts) {
      accData[accId] = [];
      accTotal[accId] = this.data.accounts[accId].initialBalance;
      totalAmount += this.data.accounts[accId].initialBalance;
    }

    for (const day in days) {
      for (const trans of days[day]) {
        totalAmount = round(totalAmount + trans.amount);
        accTotal[trans.accountId] = round(accTotal[trans.accountId] + trans.amount);
      }

      const date = days[day][0].date;
      totalData.push({ t: date, y: totalAmount });
      for (let accId in accData) {
        accData[accId].push({ t: date, y: accTotal[accId] });
      }
    }

    totalData.push({ t: new Date(), y: totalAmount });
    this.chartData = [this.generateDataset('Total', totalData, 0)];

    let index = 1;
    for (let accId in accData) {
      accData[accId].push({ t: new Date(), y: accTotal[accId] });
      this.chartData.push(this.generateDataset(this.data.accounts[accId].name, accData[accId], index++));
    }

    if (this.chart) {
      this.chart.data.datasets = this.chartData;
      this.chart.update();
    }
  }

  generateDataset(label: string, data: ChartDataPoint[], index: number): Chart.ChartDataSets {
    const length = Object.keys(this.data.accounts).length + 1;
    const hue = (360 * index) / length;
    const color = `hsl(${hue}, 60%, 60%)`;
    return {
      label,
      data,
      fill: this.data.user.chartsFill,
      backgroundColor: color,
      borderColor: color,
      pointRadius: 0,
      steppedLine: this.data.user.chartsLineStyle == 'stepped',
      lineTension: this.data.user.chartsLineStyle == 'round' ? 0.4 : 0,
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
              let label = data.datasets[tooltipItem.datasetIndex].label + ': ' || '';
              return label + tooltipItem.yLabel + '€';
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
                round: 'day',
                minUnit: 'day',
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
