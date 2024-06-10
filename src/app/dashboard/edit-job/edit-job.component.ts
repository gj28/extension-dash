import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PeriodicElement } from '../dashboard/dashboard.component';
import { DashService } from '../dash.service';
import { DashDataServiceService } from '../dash-data-service/dash-data-service.service';

@Component({
  selector: 'app-edit-job-dialog',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.css']
})
export class EditJobDialogComponent {
  editJobForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditJobDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PeriodicElement,
    private fb: FormBuilder
  ) {
    this.editJobForm = this.fb.group({
      location: [data.location, Validators.required],
      role: [data.role, Validators.required],
      business_area: [data.business_area, Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.editJobForm.valid) {
      this.dialogRef.close(this.editJobForm.value);
    }
  }
}
