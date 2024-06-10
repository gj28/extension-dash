import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashDataServiceService } from '../dash-data-service/dash-data-service.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { DashService } from '../dash.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(
    private dashdataService: DashDataServiceService,
    private authService: AuthService,
    public snackBar: MatSnackBar,
    public dashService: DashService
  ) {}

  userId!: string | null;
  fullName!: string; // Changed from fname and lname
  companyEmail!: string;
  personalEmail!: string;
  companyName: string = 'ANTi Ai'; // Hard-coded company name
  location!: string;
  designation!: string;
  contactNo!: string;
  password: string = '';
  CPassword: string = '';
  hidePassword = true;
  hideConfirmPassword = true;
  cancelCompany: boolean = false;
  cancelPersonal: boolean = false;
  cancelPassword: boolean = false;
  dataSource: any;

  ngOnInit() {
    this.getUserDetail();
    this.dashService.isPageLoading(true);
  }

  toggleCompany() {
    this.cancelCompany = !this.cancelCompany;
  }

  togglePersonal() {
    this.cancelPersonal = !this.cancelPersonal;
  }

  togglePassword() {
    this.cancelPassword = !this.cancelPassword;
  }

  updatePassword() {
    if (this.password !== this.CPassword) {
      this.snackBar.open('Passwords do not match!', 'Dismiss', {
        duration: 2000
      });
      return;
    }

    const passwordData = {
      password: this.password,
    };

    if (this.userId) {
      this.dashdataService.updatePassword(this.userId, passwordData).subscribe(
        () => {
          this.snackBar.open('Successfully updated password!', 'Dismiss', {
            duration: 2000
          });
          // Additional logic if needed
          this.getUserDetail();
          this.togglePassword();
        },
        (error) => {
          this.snackBar.open('Error updating password!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    } else {
      this.snackBar.open('UserId is not available!', 'Dismiss', {
        duration: 2000
      });
    }
  }

  getUserDetail() {
    this.userId = sessionStorage.getItem('userid');
    console.log(sessionStorage);

    if (this.userId) {
      this.dashdataService.getUserData(this.userId).subscribe(
        (user: any) => {
          this.dashService.isPageLoading(false);
          this.dataSource = user.getUserById;
          console.log(this.dataSource)
          this.fullName = this.dataSource[0].fullname; // Changed from fname and lname
          this.companyEmail = this.dataSource[0].personalemail;
          this.personalEmail = this.dataSource[0].personalemail;
          this.designation = this.dataSource[0].usertype;
          this.contactNo = "9999999999";
          this.location = "Jaipur, Rajasthan";
        },
        () => {
          this.snackBar.open('Error fetching user details!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    } else {
      this.snackBar.open('No User Data Available!', 'Dismiss', {
        duration: 2000
      });
    }
  }

  updatePersonal() {
    const personalData = {
      fullName: this.fullName, // Changed from fname and lname
    };
    if (this.userId) {
      this.dashdataService.updatePersonalDetails(this.userId, personalData).subscribe(
        () => {
          this.snackBar.open('Successfully Updated!', 'Dismiss', {
            duration: 2000
          });
          this.getUserDetail();
          this.togglePersonal();
        },
        () => {
          this.snackBar.open('Error updating personal details!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    } else {
      this.snackBar.open('UserId is not available!', 'Dismiss', {
        duration: 2000
      });
    }
  }

  updateCompany() {
    const companyData = {
      contact: this.contactNo,
      location: this.location
    };
    if (this.userId) {
      this.dashdataService.updateCompanyDetails(this.userId, companyData).subscribe(
        () => {
          this.snackBar.open('Successfully Updated!', 'Dismiss', {
            duration: 2000
          });
          this.getUserDetail();
          this.toggleCompany();
        },
        () => {
          this.snackBar.open('Error updating company details!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    } else {
      this.snackBar.open('UserId is not available!', 'Dismiss', {
        duration: 2000
      });
    }
  }
}
