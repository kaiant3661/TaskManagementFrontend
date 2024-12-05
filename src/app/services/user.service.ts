// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';  // Assuming you have a User interface

@Injectable()
export class UserService {
  private apiUrl = 'http://localhost:5096/api/userr';  // Replace with actual URL

  constructor(private http: HttpClient) {}


  // Register a new user
  registerUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData);  // Posting the user data directly
  }

  // Get user profile by ID
  getUserProfile(userId: string): Observable<User> {
    return this.http.get<User>(this.apiUrl + `/${userId}`);
  }

  // Update user profile
  updateUserProfile(user: User): Observable<any> {
    return this.http.put(this.apiUrl + '/update', user);
  }
  deleteUser(userId: number): Observable<any> {
    const performedBy = Number(sessionStorage.getItem('userId')) || 0; // Default to 0 if not valid
    if (!performedBy) {
      throw new Error('Invalid performedBy user ID from sessionStorage.');
    }
    const url = `${this.apiUrl}/${userId}?performedBy=${performedBy}`;
    return this.http.delete(url);
  }
  
  // Get all users (for admin purposes)
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
   // Get all users (for admin purposes)
   getallUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }


   // Soft delete user by userId (API call for soft delete)
   softDeleteUser(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/soft-delete/${userId}`, {});
  }

  // Restore a soft-deleted user by userId (API call for restore)
  restoreUser(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/restore/${userId}`, {});
  }

}
