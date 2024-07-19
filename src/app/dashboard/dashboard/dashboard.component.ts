import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DashService } from '../dash.service';
import { DashDataServiceService } from '../dash-data-service/dash-data-service.service';
import { AddJobsComponent } from '../add-jobs/add-jobs.component';
import { EditJobDialogComponent } from '../edit-job/edit-job.component'; // Import the new dialog component
import Swal from 'sweetalert2';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loadStatus: number = 2;
  cpuUsage: number = 0;
  cpuCores: number = 1;
  memoryUsage: number = 18.1;
  memoryUsed: number = 178;
  memoryTotal: number = 981;
  diskUsage: number = 16;
  diskUsed: number = 5.7;
  diskTotal: number = 40;
  siteCount: number = 0;
  ftpCount: number = 0;
  dbCount: number = 0;
  securityIssues: number = 2;

  constructor() { }

  ngOnInit() {
    this.createTrafficChart();
  }

  update() {
    // Logic to update the data
  }

  reset() {
    // Logic to reset the data
  }

  createTrafficChart() {
    const ctx = document.getElementById('trafficChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['14:15:27', '14:15:30', '14:15:34', '14:15:38', '14:15:42', '14:15:46', '14:15:50'],
        datasets: [{
          label: 'Traffic',
          data: [0.42, 0.32, 0.50, 0.20, 0.25, 0.44, 0.66],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  getCircleStyle(value: number): string {
    const color = value > 75 ? '#ff6b6b' : value > 50 ? '#ffa502' : '#2ed573';
    return `conic-gradient(${color} ${value}%, #ddd ${value}%)`;
  }
}


export interface PeriodicElement {
  id: number;
  location: string;
  role: string;
  business_area: string;
  created_at: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];
