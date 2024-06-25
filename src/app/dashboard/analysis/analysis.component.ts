import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DashService } from '../dash.service';
import { DashDataServiceService } from '../dash-data-service/dash-data-service.service';

@Component({
  selector: 'app-analysis',
  styleUrls: ['./analysis.component.css'],
  templateUrl: './analysis.component.html',
})
export class AnalysisComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id', 'name', 'email', 'contact_no', 
    'current_location', 'resume_link', 'role', 
    'status', 'created_at', 'actions'
  ];

  dataSource = new MatTableDataSource<Applicant>([]);
  statusOptions = [
    { value: '0', viewValue: 'Screening' },
    { value: '1', viewValue: 'HR Interview' },
    { value: '2', viewValue: 'Under Process' },
    { value: '3', viewValue: 'No Response' },
    { value: '4', viewValue: 'Backup' },
    { value: '5', viewValue: 'Technical Interview' },
    { value: '6', viewValue: 'Selected' },
    { value: '-1', viewValue: 'Rejected' }
  ];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    public dashService: DashService, 
    public service: DashDataServiceService
  ) {}

  ngOnInit() {
    this.dashService.isPageLoading(true);
    this.getallapplicants();

    // Customize the filter predicate to filter by both name and role
    this.dataSource.filterPredicate = (data: Applicant, filter: string) => {
      const lowerCaseFilter = filter.toLowerCase();
      return data.role.toLowerCase().includes(lowerCaseFilter) ||
             data.name.toLowerCase().includes(lowerCaseFilter);
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getallapplicants() {
    this.service.getAllApplicants().subscribe(
      (response: Applicant[]) => {
        this.dataSource.data = response;
        console.log(response);
        this.dashService.isPageLoading(false); // Set loading to false after fetching data
      },
      (error) => {
        console.error('Error fetching data', error);
        this.dashService.isPageLoading(false); // Ensure loading is set to false on error too
      }
    );
  }

  openResume(resumeLink: string) {
    const contentContainer = document.querySelector('.content');
    if (contentContainer) {
      contentContainer.classList.add('blur-background');
    }

    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const windowWidth = Math.min(800, screenWidth * 0.8);
    const windowHeight = Math.min(600, screenHeight * 0.8);
    const resumeWindow = window.open(resumeLink, '_blank', `toolbar=yes,scrollbars=yes,resizable=yes,top=${(screenHeight - windowHeight) / 2},left=${(screenWidth - windowWidth) / 2},width=${windowWidth},height=${windowHeight}`) as Window | null;

    if (resumeWindow) {
      const checkResumeClosed = setInterval(() => {
        if (resumeWindow.closed) {
          clearInterval(checkResumeClosed);
          if (contentContainer) {
            contentContainer.classList.remove('blur-background');
          }
          console.log('Resume window closed');
        }
      }, 1000);
    } else {
      console.error('Failed to open resume window');
      if (contentContainer) {
        contentContainer.classList.remove('blur-background');
      }
    }
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 0:
        return 'status-screening';
      case 1:
        return 'status-hr-interview';
      case 2:
        return 'status-under-process';
      case 3:
        return 'status-no-response';
      case 4:
        return 'status-backup';
      case 5:
        return 'status-technical-interview';
      case 6:
        return 'status-selected';
      case -1:
        return 'status-rejected';
      default:
        return '';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'Screening';
      case 1:
        return 'HR_Interview';
      case 2:
        return 'Under_Process';
      case 3:
        return 'No_Response';
      case 4:
        return 'Backup';
      case 5:
        return 'Technical_Interview';
      case 6:
        return 'Selected';
      case -1:
        return 'Rejected';
      default:
        return '';
    }
  }

  updateStatus(newStatus: string, id: number) {
    if (newStatus !== null) {
      const ApplicationStatus = { status: newStatus };
      this.service.updateApplicantStatus(ApplicationStatus, id).subscribe(
        (response) => {
          console.log('Status updated successfully:', response);
          const updatedApplicant = this.dataSource.data.find(applicant => applicant.id === id);
          if (updatedApplicant) {
            updatedApplicant.status = newStatus;
          }
          this.getallapplicants();
          this.dataSource._updateChangeSubscription(); // Refresh the table data
        },
        (error) => {
          console.error('Error updating status:', error);
        }
      );
    } else {
      console.error('Status is required.');
    }
  }

  applyRoleFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  applyNameFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
}

export interface Applicant {
  id: number;
  name: string;
  email: string;
  contact_no: string;
  current_location: string;
  resume_link: string;
  role: string;
  status: string;
  created_at: string;
}
