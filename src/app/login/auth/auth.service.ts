import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token!: string | null;

  constructor(private http: HttpClient, private router: Router) {}
  // private readonly API_URL = 'https://anti-backend.onrender.com';
  private readonly API_URL = 'https://webextension-8p1b.onrender.com';

  updatePersonalDetails(userId: string, personalData: any): Observable<any> {
    return this.http.put(`${this.API_URL}/users/${userId}`, personalData);
  }

  login(loginData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, loginData);
  }
  
  getToken(): string | null {
    return this.token || sessionStorage.getItem('token');
  }
  
  setToken(token: string): void {
    this.token = token;
    console.log(sessionStorage);
    sessionStorage.setItem('token', token); // Store the token in the session storage

    // Fetch user details immediately after setting the token
    this.getUserDetails();
  }

  setUserType(userType: string) {
    sessionStorage.setItem('userType', userType);
  }

  getUserType(): string | null {
    return sessionStorage.getItem('userType');
  }

  setUserId(UserId: string){
    sessionStorage.setItem('userid', UserId);
  }

  getUserId(): string | null {
    return sessionStorage.getItem('UserId');
  }

  setCompanyEmail(companyEmail: string){
    sessionStorage.setItem('companyEmail', companyEmail);
  }

  getCompanyEmail(): string | null {
    return sessionStorage.getItem('companyEmail');
  }

  fullName(fullname?: string): string | null {
    if (fullname) {
      sessionStorage.setItem('fullname', fullname);
      return null; // or whatever you want to return when setting
    } else {
      return sessionStorage.getItem('fullname');
    }
  }

  setCompanyName(companyName: string){
    sessionStorage.setItem('companyName', companyName);
  }

  getCompanyName(): string | null {
    return sessionStorage.getItem('companyName');
  }

  getUserDetails(): void {
    const token = this.getToken();
    console.log(token);
    if (token) {
      this.http.get(`${this.API_URL}/user`, { headers: { Authorization: `Bearer ${token}` } })
        .subscribe(
          (response: any) => {
            const user = response;
  
            // Extracting data from the response
            const userType = user.usertype;
            const userId = user.userid;
            const companyEmail = user.personalemail;
            const fullName = user.fullname;
  
            // Setting the extracted data
            this.setUserType(userType);
            this.setUserId(userId);
            this.setCompanyEmail(companyEmail);
            this.fullName(fullName); // Store the full name in the session storage
          },
          (error: any) => {
            console.error(error);
          }
        );
    }
  }
  
  
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('CompanyEmail');
    this.isLoggedIn();
    this.router.navigate(['/login/login']);
  }
}
