import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DashService } from '../dash.service';
import { DashDataServiceService } from '../dash-data-service/dash-data-service.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['url', 'actions'];
  dataSource = new MatTableDataSource<TabData>(ELEMENT_DATA);
  selectedApplicantId: any;
  selectedStatus: string = ''; 
  toggle: boolean = false;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; 
  data: any;

  constructor(private dashDataService: DashDataServiceService, public dashService: DashService, public service: DashDataServiceService, public dialog: MatDialog, private http: HttpClient) {} 

  ngOnInit() {  
    this.dashService.isPageLoading(true);
    this.getTabData();
  }

  handleToggleChange(event: any) {
    this.toggle = event.checked;
    console.log('Toggle changed to: ', this.toggle);
    
    if (this.toggle) {
      const payload = { close: true };
      this.dashDataService.liveTabs(payload).subscribe(
        (response) => {
          console.log('Response from liveTabs:', response);
        },
        (error) => {
          console.error('Error from liveTabs:', error);
        }
      );
    }
  }

  deleteUser(url: string) {
    if (url) {
      const payload = { url };
  
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.dashDataService.deletetTab(payload).subscribe(
            () => {
              Swal.fire('Deleted!', 'The website has been deleted.', 'success');
              this.getTabData(); // Refresh the table after deletion
            },
            (error) => {
              Swal.fire('Error!', 'Failed to delete the website. Please try again.', 'error');
            }
          );
        }
      });
    }
  }
  
  getTabData() {
    this.service.gettabData().subscribe(
      (response: { [key: string]: string }) => {
        const tabData: TabData[] = Object.keys(response).map((key, index) => ({
          id: (index + 1).toString(), // Generating sequential IDs starting from 1
          url: response[key]
        }));
        this.dataSource.data = tabData;
        this.dashService.isPageLoading(false);
      },
      (error) => {
        console.error('Error fetching tab data', error);
        this.dashService.isPageLoading(false);
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

export interface TabData {
  url: string;
  id: string;
}

const ELEMENT_DATA: TabData[] = [];
