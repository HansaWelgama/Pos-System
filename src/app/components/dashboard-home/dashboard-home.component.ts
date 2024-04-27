import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {RouterLink} from "@angular/router";
import {MatButton} from "@angular/material/button";

// import {
//   ChartComponent,
//   ApexAxisChartSeries,
//   ApexChart,
//   ApexXAxis,
//   ApexDataLabels,
//   ApexTitleSubtitle,
//   ApexStroke,
//   ApexGrid, NgApexchartsModule
// } from "ng-apexcharts";


// export type ChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   xaxis: ApexXAxis;
//   dataLabels: ApexDataLabels;
//   grid: ApexGrid;
//   stroke: ApexStroke;
//   title: ApexTitleSubtitle;
// };

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    RouterLink,
    MatButton,
    //NgApexchartsModule,

  ],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent{  //implements AfterViewInit {
  // @ts-ignore
  @ViewChild("chart") chart: ChartComponent;
  // @ts-ignore
  public chartOptions: Partial<ChartOptions>;
  // constructor() {
  //   this.chartOptions = {
  //     series: [
  //       {
  //         name: "Desktops",
  //         data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
  //       }
  //     ],
  //     chart: {
  //       height: 350,
  //       type: "line",
  //       zoom: {
  //         enabled: false
  //       }
  //     },
  //     dataLabels: {
  //       enabled: false
  //     },
  //     stroke: {
  //       curve: "straight"
  //     },
  //     title: {
  //       text: "Product Trends by Month",
  //       align: "left"
  //     },
  //     grid: {
  //       row: {
  //         colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
  //         opacity: 0.5
  //       }
  //     },
  //     xaxis: {
  //       categories: [
  //         "Jan",
  //         "Feb",
  //         "Mar",
  //         "Apr",
  //         "May",
  //         "Jun",
  //         "Jul",
  //         "Aug",
  //         "Sep"
  //       ]
  //     }
  //   };
  // }

  // ngAfterViewInit(): void {
  //
  //   }
}
