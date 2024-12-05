import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { UserProfileService } from './user-profile.service';  // Import UserProfileService
import { Observable as RxObservable } from 'rxjs/Observable'; // To use Observable.throw

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do'; 

@Injectable()
export class AuthService {
  private apiUrl = 'http://localhost:5096/api/auth';
  private tokenKey = 'userToken';  // Token key in sessionStorage
  private userIdKey = 'userId';    // User ID key in sessionStorage
  private userRoleKey = 'user_role';  // User role key in sessionStorage
  
  constructor(private http: HttpClient, private userProfileService: UserProfileService) {}

  // Login function to authenticate and store token, userId, and user role
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
  
    // Initial login call to fetch the token and userId
    return this.http.post(`${this.apiUrl}/login`, body)
      .switchMap((response: any) => {
        // Store token and userId in sessionStorage
        sessionStorage.setItem(this.tokenKey, response.token);
        sessionStorage.setItem(this.userIdKey, response.userId);
  
        // Fetch user profile to retrieve the role
        return this.userProfileService.getUserProfile(response.userId)
          .do((userProfile: any) => {
            sessionStorage.setItem(this.userRoleKey, userProfile.role.roleName); // Store user role
          })
          .map(() => response); // Return the original response after role is stored
      })
      .catch((error) => {
        console.error('Error logging in', error);
        return Observable.throw(error); // Use Observable.throw for Angular 5
      });
  }

  // Register function to register the user
  register(email: string, password: string, firstName: string, lastName: string): Observable<any> {
    const body = { email, password, firstName, lastName };
    console.log('Register Request:', body); // Log the request body

    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' }; // Headers
    return this.http.post(`${this.apiUrl}/register`, body, { headers })
      .map((response: any) => response)
      .catch(error => {
        console.error('Error registering', error);
        return RxObservable.throw(error);
      });
  }

  // Check if user is authenticated (token exists)
  isAuthenticated(): boolean {
    const token = sessionStorage.getItem(this.tokenKey);  // Get token from storage
    return token != null;  // Return true if token exists, meaning user is logged in
  }

  // Get the current logged-in user's ID
  getUserId(): string | null {
    return sessionStorage.getItem(this.userIdKey);  // Get the user ID from storage
  }
  getUserrole(): string | null {
    return sessionStorage.getItem(this.userRoleKey);  // Get the user ID from storage
  }


  // Logout function: clear both token and userId from sessionStorage
  logout(): void {
    sessionStorage.removeItem(this.tokenKey);  // Remove token from storage
    sessionStorage.removeItem(this.userIdKey);  // Remove user ID from storage
    sessionStorage.removeItem(this.userRoleKey);  // Remove user role from storage
  }
}
