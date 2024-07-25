import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DashDataServiceService {

  public pageLoading = true;
  public dataLoading = true;
 

  constructor(private http: HttpClient, private router: Router) {}

  // private readonly API_URL = 'https://anti-backend.onrender.com';
  private readonly API_URL = 'https://webextension-8p1b.onrender.com'; 

  userDetails():Observable<any> {
    return this.http.get(`${this.API_URL}/fetchAllUsers`);
  }
  fetchdevs():Observable<any> {
    return this.http.get(`${this.API_URL}/fetchdevs`);
  }
  deviceDetails(CompanyEmail: string):Observable<any> {
    return this.http.get(`${this.API_URL}/getDeviceForUsers/${CompanyEmail}`);
  }

  getUserData(userId: string):Observable<any> {
    return this.http.get(`${this.API_URL}/fetchUserById/${userId}`);
  }
  
  gettabData():Observable<any> {
    return this.http.get(`${this.API_URL}/liveTabs`);
  }

  deletetTab(tabData: any):Observable<any> {
    return this.http.post(`${this.API_URL}/closeTab`, tabData);
  }

  liveTabs(tabData: any):Observable<any> {
    return this.http.post(`${this.API_URL}/closeLiveTabs`, tabData);
  }

  reportData(reportData: any):Observable<any> {
    return this.http.post(`${this.API_URL}/getReportData`, reportData);
  }

  updatePersonalDetails(userId: string, personalData: any): Observable<any> {
    return this.http.put(`${this.API_URL}/users/${userId}`, personalData);
  }
  
  addDevice(deviceData:any):Observable<any> {
    return this.http.post(`${this.API_URL}/add-Device`,deviceData);
  }

  addUser(userData:any):Observable<any> {
    return this.http.post(`${this.API_URL}/addUser`,userData);
  }

  deleteUser(userId:string):Observable<any> {
    return this.http.delete(`${this.API_URL}/deleteUser/${userId}`);
  }

  deleteDevice(deviceID:string):Observable<any> {
    return this.http.delete(`${this.API_URL}/delete-Device/${deviceID}`);
  }

  editDevice(entryId:string,deviceData:any):Observable<any> {
    return this.http.put(`${this.API_URL}/edit-Device/${entryId}`,deviceData);
  }

  editUser(UserId:string,userData:any):Observable<any> {
    return this.http.put(`${this.API_URL}/editUser/${UserId}`,userData);
  }

  analyticsDataByCustomForPieChart(deviceId: string, startDate: any, endDate: any): Observable<any> {
    const params = { start: startDate, end: endDate };
    return this.http.post(`${this.API_URL}/get-Analytics-Data-OnTime-Total-customs/${deviceId}`, params);
  }

  analyticsDataByIntervalForPieChart(deviceID: string | null, interval: any): Observable<any> {
    // Use the second argument to provide the query parameters
    return this.http.get(`${this.API_URL}/get-Analytics-Data-OnTime-Total-interval/${deviceID}/intervals?interval=${interval}`);
  }

  analyticsDataByCustomForLineChart(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/get-Analytics-Data-Line-Total-customs`, data);
  }

  analyticsDataByIntervalForLineChart(deviceID: string | null, interval: any): Observable<any> {
    // Use the second argument to provide the query parameters
    return this.http.get(`${this.API_URL}/get-Analytics-Data-Line-Total-interval/${deviceID}?interval=${interval}`);
  }

  analyticsDataByIntervalForBarChart(deviceID: string | null, interval: any): Observable<any> {
    // Use the second argument to provide the query parameters
    return this.http.get(`${this.API_URL}/get-Analytics-Data-Bar-Total-interval/${deviceID}/intervals?interval=${interval}`);
  }

  analyticsDataByCustomForBarChart(deviceId: string, startDate: any, endDate: any): Observable<any> {
    // Use the second argument to provide the query parameters
    const params = { start: startDate, end: endDate };
    return this.http.get(`${this.API_URL}/get-Analytics-Data-Bar-Total-Custom/${deviceId}`, { params });
  }

  updateCompanyDetails(UserId:string,companyData:any):Observable<any> {
    return this.http.put(`${this.API_URL}/updateCompanyDetails/${UserId}`,companyData);
  }

  updatePassword(UserId:string,passwordData:any):Observable<any> {
    return this.http.put(`${this.API_URL}/updatePassword/${UserId}`,passwordData);
  }

  updateContactDetails(UserId:string,contactData:any):Observable<any> {
    return this.http.put(`${this.API_URL}/updateContactDetails/${UserId}`,contactData);
  }

  getDeviceData(CompanyEmail: string): Observable <any> {
    return this.http.get(`${this.API_URL}/getLatestEntry/${CompanyEmail}`);
  }

  public isPageLoading(isLoading: boolean) {
    this.pageLoading = isLoading;
  }
  public isDataLoading() {
    this.dataLoading = !this.dataLoading;
  }
  getAllApplicants():Observable<any> {
    return this.http.get(`${this.API_URL}/fetchAllapplicant`);
  }
  getAllJobs():Observable<any> {
    return this.http.get(`${this.API_URL}/fetchAllPosition`);
  }
  updateApplicantStatus(ApplicationStatus: any, id: any): Observable<any> {
    return this.http.put(`${this.API_URL}/ApplicationStatus/${id}`, ApplicationStatus);
  }
  updatejob(updatejob: any, id: any): Observable<any> {
    return this.http.put(`${this.API_URL}/editOpenPosition/${id}`, updatejob);
  }
  
  postnewJobs(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/postOpenPosition`, data);
  }

  updateJob(updatejob: any, id: number): Observable<any> {
    return this.http.put(`${this.API_URL}/editOpenPosition/${id}`, updatejob);
  }

  deleteJob(id:any):Observable<any> {
    return this.http.delete(`${this.API_URL}/deleteOpenPosition/${id}`);
  }
  
  

}