// src/app/services/task.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';  // Assuming you have a Task model

import { AuthService } from './auth.service';  // Import AuthService to get the current user


@Injectable()
export class TaskService {
  private apiUrl = 'http://localhost:5096/api/task';  // Original API URL

  constructor(private http: HttpClient, private authService: AuthService) {}
  
  getTasks(page: number, pageSize: number = 7): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getPaginatedtask?page=${page}&pageSize=${pageSize}`);
  }
  

  // Get all tasks
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // Get task by ID
  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  // Create a new task
  createTask(task: Task): Observable<Task> {
    task.createdByUserId = Number(localStorage.getItem('userId'));

    return this.http.post<Task>(this.apiUrl, task);
  }

  // Update task by ID
  updateTask(id: number, task: Task): Observable<Task> {
    task.createdByUserId = Number(localStorage.getItem('userId'));
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  // Delete task by ID
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getUserTasks(): Observable<Task[]> {
    const userId = this.authService.getUserId();  // Get the user ID from AuthService
    if (!userId) {
      throw new Error('User not authenticated');  // Ensure the user is authenticated
    }

    // Filter tasks where the user is either assigned or has created the task
    return this.http.get<Task[]>(`${this.apiUrl}/user/${userId}`);
  }

  getUserTaskss(userId: string): Observable<Task[]> {
    if (!userId) {
      throw new Error('User ID is required');  // Ensure userId is passed
    }

    // Fetch tasks for the given userId
    return this.http.get<Task[]>(`${this.apiUrl}/user/${userId}`);
  }
}
