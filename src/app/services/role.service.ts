// src/app/services/role.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RoleService {
  private apiUrl = 'http://localhost:5096/api/role';  // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  // Get all roles
  getAllRoles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  // Create a new role
  createRole(role: { roleName: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, role);
  }
}
