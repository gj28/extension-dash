import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DashDataServiceService } from '../dash-data-service/dash-data-service.service';

@Component({
  selector: 'app-add-jobs',
  templateUrl: './add-jobs.component.html',
  styleUrls: ['./add-jobs.component.css']
})
export class AddJobsComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddJobsComponent>,
    private fb: FormBuilder,
    public service : DashDataServiceService
  ) {
    this.form = this.fb.group({
      location: ['', Validators.required],
      role: ['', Validators.required],
      business_area: ['', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // onSubmit(): void {
  //   if (this.form.valid) {
  //     console.log(this.form.value);
  //     this.dialogRef.close(this.form.value);
  //   }
  // }
  onSubmit(): void {
    if (this.form.valid) {
      console.log(this.form.value);
      this.service.postnewJobs(this.form.value).subscribe(
        response => {
          console.log('Job posted successfully:', response);
          this.dialogRef.close(this.form.value);
        },
        error => {
          console.error('Error posting job:', error);
        }
      );
    }
  }
}
