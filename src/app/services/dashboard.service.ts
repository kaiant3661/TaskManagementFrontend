import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TaskService {
  private baseUrl: string = 'http://localhost:5000/api/task'; // Adjust to your backend API URL

  constructor(private http: HttpClient) {}

  // Fetch all tasks from the backend
  getAllTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // Filter tasks by user ID
  getTasksByUserId(userId: number): Observable<any[]> {
    return this.getAllTasks().pipe(
      map(tasks => tasks.filter(task => task.createdByUserId === userId))
    );
  }
}
