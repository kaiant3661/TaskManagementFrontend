import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuditLogService {
  private apiUrl = 'http://localhost:5096/api/auditlog'; // API base URL

  constructor(private http: HttpClient) {}

  // Fetch all audit logs
  getAllAuditLogs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
      .catch(this.handleError);
  }

  // Fetch audit log by ID
  getAuditLogById(logId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${logId}`)
      .catch(this.handleError);
  }

  // Delete all logs
  clearAllLogs(): Observable<any> {
    return this.http.delete<any>(this.apiUrl)
      .catch(this.handleError);
  }

  // Delete logs by user ID
  deleteLogsByUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/user/${userId}`)
      .catch(this.handleError);
  }

  // Delete logs by action
  clearLogsByAction(actionType: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/action/${actionType}`)
      .catch(this.handleError);
  }

  // Search logs by date
  searchLogsByDate(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/date/${date}`)
      .catch(this.handleError);
  }

  // Search logs by user ID
  searchLogsByUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`)
      .catch(this.handleError);
  }

  // Search logs by action
  searchLogsByAction(action: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?action=${action}`)
      .catch(this.handleError);
  }

  private handleError(error: any): Observable<any> {
    console.error('Error occurred:', error);
    return Observable.throw(error.message || 'Server Error');
  }
}
