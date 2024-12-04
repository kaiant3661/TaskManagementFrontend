import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';  // Import AuthService

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];  // Array to hold the filtered tasks
  filteredTasks: Task[] = [];  // Array to hold tasks after filtering/searching
  currentDate: Date = new Date();  // Current date and time
  userId: string;  // Store the userId for navigation
  searchQuery: string = '';  // For search query
  selectedTask: Task | null = null;

  // New variables to store task counts
  totalTasksCount: number = 0;
  pendingTasksCount: number = 0;
  completedTasksCount: number = 0;
  inProgressTasksCount: number = 0;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Assuming the userId is stored in localStorage after login
    this.userId = localStorage.getItem('userId');  // Fetch userId from localStorage

    // Get tasks for the current user when the component initializes
    this.taskService.getUserTasks().subscribe(
      (tasks: Task[]) => {
        this.tasks = tasks;  // Store the tasks
        this.filteredTasks = [...this.tasks];  // Initialize filtered tasks

        // Populate the task counts
        this.populateTaskCounts();
      },
      error => {
        console.error('Error fetching tasks', error);
      }
    );
  }

  // Function to populate task counts
  populateTaskCounts(): void {
    this.totalTasksCount = this.tasks.length;
    this.pendingTasksCount = this.tasks.filter(task => task.status === 'Pending').length;
    this.completedTasksCount = this.tasks.filter(task => task.status === 'Completed').length;
    this.inProgressTasksCount = this.tasks.filter(task => task.status === 'InProgress').length;
  }

  // Function to check if the deadline has passed
  isDeadlinePassed(dueDate: string): boolean {
    const taskDeadline = new Date(dueDate);
    return taskDeadline < this.currentDate;
  }

  // Function to start a task by setting its status to "In Progress"
  startTask(task: Task): void {
    task.status = 'InProgress';  // Update task status to In Progress
    this.taskService.updateTask(task.taskId, task).subscribe(
      () => {
        console.log('Task started successfully');
        this.refreshTasks();  // Refresh task list after status update
      },
      error => {
        console.error('Error starting task', error);
      }
    );
  }

  // Function to mark a task as completed
  markAsCompleted(task: Task): void {
    task.status = 'Completed';  // Update task status to Completed
    this.taskService.updateTask(task.taskId, task).subscribe(
      () => {
        console.log('Task marked as completed');
        this.refreshTasks();  // Refresh task list after status update
      },
      error => {
        console.error('Error updating task', error);
      }
    );
  }

  // Sort tasks by deadline
  sortTasksByDeadline(): void {
    this.filteredTasks.sort((a, b) => {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }

  // Filter tasks by status (In Progress, Completed)
  // Add this method to filter tasks based on their status
filterTasksByStatus(status: string): void {
  if (status === 'All') {
    this.filteredTasks = [...this.tasks];  // Show all tasks
  } else {
    this.filteredTasks = this.tasks.filter(task => task.status === status);  // Filter tasks by the selected status
  }
}


  // Search tasks by title
  searchTasks(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredTasks = [...this.tasks];  // Reset to all tasks if search is empty
    } else {
      this.filteredTasks = this.tasks.filter(task => 
        task.taskName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  // Refresh the task list to reset any filtering
  refreshTasks(): void {
    this.filteredTasks = [...this.tasks];  // Reset filtered tasks to the original list
    this.populateTaskCounts();  // Recalculate task counts after updates
  }

  // Navigate to the user profile page with the userId
  navigateToProfile(): void {
    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      this.router.navigate([`/profile/${this.userId}`]);  // Pass userId as part of the URL
    } else {
      console.error('User ID not found');
    }
  }

  // Logout the user and redirect to login page
  logout(): void {
    this.authService.logout();  // Call logout method from AuthService
    this.router.navigate(['/login']);  // Redirect to login page
  }

  // Open the task details modal
  openTaskDetails(task: Task): void {
    this.selectedTask = task;
  }

  // Close the task details modal
  closeTaskDetails(): void {
    this.selectedTask = null;
  }
}
