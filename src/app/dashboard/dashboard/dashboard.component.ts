import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DashService } from '../dash.service';
import { DashDataServiceService } from '../dash-data-service/dash-data-service.service';
import { AddJobsComponent } from '../add-jobs/add-jobs.component';
import { EditJobDialogComponent } from '../edit-job/edit-job.component'; // Import the new dialog component
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['id', 'location', 'role', 'business_area', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selectedApplicantId: any;
  selectedStatus: string = ''; 

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; 
  data: any;

  constructor(private dashDataService: DashDataServiceService, public dashService: DashService, public service: DashDataServiceService, public dialog: MatDialog) {} 

  ngOnInit() {  
    this.dashService.isPageLoading(true);
    this.getallapplicants();
  }

  updateStatus(newStatus: string, id: any) {
    if (this.selectedStatus !== null) {
      const ApplicationStatus = { status: this.selectedStatus };
      this.service.updateApplicantStatus(ApplicationStatus, id).subscribe(
        (response) => {
          console.log('Status updated successfully:', response);
          this.getallapplicants();
        },
        (error) => {
          console.error('Error updating status:', error);
        }
      );
    } else {
      console.error('Status is required.');
    }
  }

  deleteUser(id: any) {
    if (id) {
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
          this.dashDataService.deleteJob(id).subscribe(
            () => {
              Swal.fire('Deleted!', 'Job has been deleted.', 'success');
              this.getallapplicants(); // Refresh the table after deletion
            },
            (error) => {
              Swal.fire('Error!', 'Failed to delete job. Please try again.', 'error');
            }
          );
        }
      });
    }
  }
  
  getallapplicants(){
    this.service.getAllJobs().subscribe(
      (response) => {
        this.data = response;
        this.dataSource.data = response; 
        this.dashService.isPageLoading(false);
        console.log(this.data);
      },
      (error) => {
        console.error('Error fetching data', error);
        this.dashService.isPageLoading(false);
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openAddJob(): void {
    const dialogRef = this.dialog.open(AddJobsComponent, {
      width: '250px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Swal.fire({
          title: 'Confirm Addition',
          text: 'Are you sure you want to add this job?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, add it!'
        }).then((confirmation) => {
          if (confirmation.isConfirmed) {
            // If confirmed, log the form data and refresh the table
            console.log('Form Data:', result);
            this.getallapplicants();
          }
        });
      }
    });
  }
  
  openEditDialog(element: PeriodicElement): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data = { job: element }; // Pass the selected job data

    const dialogRef = this.dialog.open(EditJobDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Swal.fire({
          title: 'Confirm Update',
          text: 'Are you sure you want to save these changes?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, update it!'
        }).then((confirmation) => {
          if (confirmation.isConfirmed) {
            this.updateJob(result, element.id); // Call updateJob with new data and job ID
          }
        });
      }
    });
  }

  updateJob(updatedJob: any, id: number) {
    this.service.updateJob(updatedJob, id).subscribe(
      (response) => {
        Swal.fire('Updated!', 'Job has been updated successfully.', 'success');
        this.getallapplicants(); // Refresh the data
      },
      (error) => {
        Swal.fire('Error!', 'Failed to update job. Please try again.', 'error');
        console.error('Error updating job:', error);
      }
    );
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
