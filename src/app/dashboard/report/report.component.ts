import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../login/auth/auth.service';
import { DashDataServiceService } from '../dash-data-service/dash-data-service.service';
import { FormControl, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Subscription, interval } from 'rxjs';
import { DashService } from '../dash.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit, OnDestroy {
  roles: string[] = ['Backend Developer', 'AI/ML Developer', 'Frontend Developer','AI/ML Developer', 'Full Stack Developer','Human Resources', 'Digital Marketing/Social Media','Finance/Accounting', 'Content Creation']; // Example roles
  displayedColumns: string[] = ['Name', 'Email', 'Contact No', 'Current Location', 'Role', 'Status'];
  dataSource = new MatTableDataSource<Applicant>([]);
  panelOpenState = false;
  first_device!: string;
  data: Applicant[] = [];
  intervalSubscription: Subscription | undefined;
  start: string = '';
  end: string = '';

  // Mapping numeric status to user-friendly labels
  statusLabels: { [key: string]: string } = {
    '0': 'Under Process',
    '1': 'Selected',
    '2': 'Hr Interview',
    '3': 'Technical Interview',
    '-1': 'Rejected'
  };

  constructor(
    public service: DashDataServiceService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private dashDataService: DashDataServiceService,
    private datePipe: DatePipe,
    public dashService: DashService
  ) { }

  ngOnInit() {
    this.getallapplicants();
    this.startInterval();
    this.dashService.isPageLoading(true);
  }

  role = new FormControl('', [Validators.required]);
  start_date = new FormControl('', [Validators.required]);
  end_date = new FormControl('', [Validators.required]);

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  currentDate: Date = new Date();
  startDate!: Date;
  endDate: Date = this.currentDate;

  ngOnDestroy() {
    this.stopInterval();
  }

  startInterval() {
    this.intervalSubscription = interval(1000).subscribe(() => {
      this.defaultData();
    });
  }

  stopInterval() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  defaultData() {
    const s = sessionStorage.getItem('start_date');
    this.start = this.datePipe.transform(s, 'yyyy-MM-dd') ?? '';
    const e = sessionStorage.getItem('end_date');
    this.end = this.datePipe.transform(e, 'yyyy-MM-dd') ?? '';
  }

  // Download CSV with status labels
  downloadCSV() {
    const csvData: any[] = [];
    // Add headers to CSV data
    csvData.push(['ID', 'Name', 'Email', 'Contact Number', 'Current Location', 'Role', 'Status', 'Date', 'Time']);

    // Add applicant data to CSV data
    this.dataSource.data.forEach((applicant: Applicant) => {
      csvData.push([
        applicant.id,
        applicant.name,
        applicant.email,
        applicant.contact_no,
        applicant.current_location,
        applicant.role,
        this.statusLabels[applicant.status.toString()], // Map status to label
        applicant.date || '', // Handle null or undefined values
        applicant.time || '' // Handle null or undefined values
      ]);
    });

    // Convert CSV data to string
    const csvString = csvData.map(row => row.join(',')).join('\n');

    // Initiate download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'applicants.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Download Excel with status labels
  downloadExcel() {
    // Replace status values with labels in the data
    const dataWithLabels = this.data.map(applicant => ({
      ...applicant,
      status: this.statusLabels[applicant.status.toString()] // Map status to label
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataWithLabels);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, 'report_data.xlsx');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(data, fileName);
  }

  // Download PDF with status labels
  downloadPDF() {
    const columns = ['ID', 'Name', 'Email', 'Contact Number', 'Current Location', 'Role', 'Status'];
    const rows = this.data.map(applicant => [
      applicant.id,
      applicant.name,
      applicant.email,
      applicant.contact_no,
      applicant.current_location,
      applicant.role,
      this.statusLabels[applicant.status.toString()], // Map status to label
      applicant.date || '',
      applicant.time || ''
    ]);

    const doc = new jsPDF();

    autoTable(doc, {
      head: [columns],
      body: rows,
    });

    doc.save('report_data.pdf');
  }

  updateStartDate(event: MatDatepickerInputEvent<any, any>): void {
    const selectedStartDate = event.value;
    this.startDate = selectedStartDate;
  }

  updateEndDate(event: MatDatepickerInputEvent<any, any>): void {
    const selectedEndDate = event.value;
    if (!this.startDate || selectedEndDate >= this.startDate) {
      this.endDate = selectedEndDate;
    } else {
      this.endDate = this.currentDate;
      console.error('End date must be greater than or equal to the start date');
    }
  }

  getallapplicants() {
    this.service.getAllApplicants().subscribe(
      (response: Applicant[]) => {
        this.dataSource.data = response;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.data = response;
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }

  applyFilter() {
    const startDate = this.start_date.value ? new Date(this.start_date.value) : new Date(0); // default to epoch start if null
    const endDate = this.end_date.value ? new Date(this.end_date.value) : new Date(); // default to current date if null

    const filteredData = this.data.filter((item: Applicant) => {
      const itemDate = new Date(item.created_at);
      
      return (
        (!this.role.value || item.role === this.role.value) &&
        (!this.start_date.value || itemDate >= startDate) &&
        (!this.end_date.value || itemDate <= endDate)
      );
    });

    this.dataSource.data = filteredData;
    if (filteredData.length === 0) {
      this.snackBar.open('No data found for the selected filters', 'Dismiss', {
        duration: 2000
      });
    }
  }

}

export interface Applicant {
  id: number;
  name: string;
  email: string;
  contact_no: string;
  current_location: string;
  role: string;
  status: string; // Keeping it string to match with the statusLabels
  date?: string; // Optional, handle in CSV/Excel/PDF export
  time?: string; // Optional, handle in CSV/Excel/PDF export
  created_at: string; // Assuming this is the correct field for date filtering
}
