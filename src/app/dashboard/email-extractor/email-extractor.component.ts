import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { DashDataServiceService } from '../dash-data-service/dash-data-service.service';

export interface Applicant {
  id: number;
  name: string;
  email: string;
  contact_no: string;
  current_location: string;
  role: string;
  status: number; // Keeping it string to match with the statusLabels
  date?: string; // Optional, handle in CSV/Excel/PDF export
  time?: string; // Optional, handle in CSV/Excel/PDF export
  created_at: string; // Assuming this is the correct field for date filtering
}

@Component({
  selector: 'app-email-extractor',
  templateUrl: './email-extractor.component.html',
  styleUrls: ['./email-extractor.component.css']
})
export class EmailExtractorComponent implements OnInit {
  roles: string[] = ['Backend Developer', 'AI/ML Developer', 'Frontend Developer', 'Full Stack Developer', 'Human Resources', 'Digital Marketing/Social Media', 'Finance/Accounting', 'Content Creation'];
  displayedColumns: string[] = ['Name', 'Email', 'Contact No', 'Current Location', 'Role', 'Status'];
  dataSource = new MatTableDataSource<Applicant>([]);
  data: Applicant[] = [];

  statusFilters: { label: string; value: string }[] = [
    { label: 'Screening', value: '0' },
    { label: 'HR Interview', value: '1' },
    { label: 'Under Process', value: '2' },
    { label: 'Technical Interview', value: '3' },
    { label: 'No Response', value: '4' },
    { label: 'Backup', value: '5' },
    { label: 'Selected', value: '6' },
    { label: 'Rejected', value: '-1' }
  ];

  selectedStatus: string | undefined;

  constructor(
    private snackBar: MatSnackBar,
    private service: DashDataServiceService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.getallapplicants();
  }

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  getallapplicants() {
    this.service.getAllApplicants().subscribe(
      (response: Applicant[]) => {
        console.log('Received applicants data:', response); // Log received data
        this.dataSource.data = response;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.data = response; // Assign to component data
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }
  

  applyFilter() {
    if (!this.selectedStatus) {
      return;
    }
  
    const selectedStatusNumber = parseInt(this.selectedStatus, 10); // Parse as integer assuming it's a number string
    if (isNaN(selectedStatusNumber)) {
      return; // Handle invalid or unexpected selectedStatus value
    }
  
    console.log('Selected Status:', selectedStatusNumber);
    console.log('All Applicants Data:', this.data);
  
    const filteredData = this.data.filter(applicant => applicant.status === selectedStatusNumber);
    console.log('Filtered Data:', filteredData);
  
    const emails = filteredData.map(applicant => applicant.email).join(', ');
    console.log('Filtered Emails:', emails);
  
    if (emails.trim() === '') {
      this.snackBar.open('No emails found for the selected filter', 'Dismiss', {
        duration: 2000
      });
    } else {
      const textField = document.createElement('textarea');
      textField.innerText = emails;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand('copy');
      textField.remove();
  
      this.snackBar.open(`Copied ${filteredData.length} emails`, 'Dismiss', {
        duration: 2000
      });
    }
  }
  
  
  
  
  
  
}
