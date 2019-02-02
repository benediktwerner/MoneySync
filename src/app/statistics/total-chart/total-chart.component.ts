import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import { DataService } from 'src/app/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-total-chart',
  templateUrl: './total-chart.component.html',
  styleUrls: ['./total-chart.component.scss'],
})
export class TotalChartComponent implements OnDestroy, AfterViewInit {
  @ViewChild('chart') private chartRef: ElementRef<HTMLCanvasElement>;
  private chart: Chart;
  private chartData: { t: number; y: number }[];
  private subscription: Subscription;

  constructor(data: DataService) {
    this.subscription = data.onTransactionsChange.subscribe(transactions => {
      let data = [];
      let total = 0;

      for (const trans of transactions.sort((a, b) => a.date.getTime() - b.date.getTime())) {
        total = round(total + trans.amount);
        data.push({
          t: trans.date,
          y: total,
        });
      }
      data.push({
        t: new Date(),
        y: total,
      });

      this.chartData = data;
      if (this.chart) {
        this.chart.data.datasets[0].data = data;
        this.chart.update();
      }
    });
  }

  ngAfterViewInit() {
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Total',
            fill: false,
            steppedLine: true,
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            data: this.chartData || [],
          },
        ],
      },
      options: {
        responsive: true,
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
          xAxes: [
            {
              type: 'time',
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
