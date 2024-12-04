import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable'; // Angular 5 specific import
import { User } from '../models/user.model';

@Injectable()
export class UserProfileService {
  private apiUrl = 'http://localhost:5096/api/userr';

  constructor(private http: HttpClient) {}

  getUserProfile(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  updateUserProfile(user: Partial<User>): Observable<User> {
  
    return this.http.put<User>(`${this.apiUrl}/${user.userId}`, user);
  }
}
