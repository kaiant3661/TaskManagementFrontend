import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.css'],
})
export class TaskManagementComponent implements OnInit {
  tasks: Task[] = [];
  users: any[] = [];
  confirmDeleteTaskId: number | null = null;
  showAddTaskModal: boolean = false;
  showUpdateTaskModal: boolean = false;
  updateTaskForm!: FormGroup;
  taskDetails: Task | null = null;
  showTaskDetailsModal: boolean = false;
  currentPage: number = 1;
  totalPages: number = 1;
 currentDate: Date = new Date();
  userId: string;  // Store the userId for navigation
  
  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,private authService: AuthService) {
      this.userId=authService.getUserId();
    }
  ngOnInit(): void {
    this.getUsers();
    this.getTasks();
    this.updateTaskForm = this.formBuilder.group({
      taskId: '',  // Add taskId form control
      taskName: '',
      status: '',
      priority: '',
      dueDate: '',
      assignedToUserId: '',
      description: '',
    });
  }

  getUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  getTasks(): void {
    this.taskService.getTasks(this.currentPage).subscribe((taskData) => {
      this.tasks = taskData.tasks;
      this.totalPages = taskData.totalPages;
    });
  }

  openAddTaskModal(): void {
    this.showAddTaskModal = true;
  }

  closeAddTaskModal(): void {
    this.showAddTaskModal = false;
  }

  handleTaskAdded(): void {
    this.getTasks();
    this.closeAddTaskModal();
  }

  confirmDelete(taskId: number): void {
    this.confirmDeleteTaskId = taskId;
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe(() => {
      this.getTasks();
      this.confirmDeleteTaskId = null;
    });
  }
  
  openUpdateTaskModal(taskId: number): void {
    this.showUpdateTaskModal = true;
    this.taskService.getTaskById(taskId).subscribe((task) => {
      // Ensure all fields are populated correctly
      this.updateTaskForm.patchValue({
        taskId: task.taskId,  // Set taskId in form
        taskName: task.taskName,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assignedToUserId: task.assignedToUserId,
        description: task.description,
      });
    });
  }
  
  
  
  

  closeUpdateTaskModal(): void {
    this.showUpdateTaskModal = false;
  }

  saveUpdatedTask(): void {
    const updatedTask = this.updateTaskForm.value;
    console.log('Updated Task:', updatedTask); // Log the form data to check if taskId is populated
  
    const taskId = updatedTask.taskId;  // Retrieve taskId from the form
  
    if (!taskId) {
      console.error('Task ID is missing!');
      return;
    }
  
    this.taskService.updateTask(taskId, updatedTask).subscribe({
      next: () => {
        this.getTasks(); // Refresh the task list
        this.showUpdateTaskModal = false;
        console.log('Task updated successfully');
      },
      error: (err) => console.error('Error updating task:', err),
    });
  }
  
  
  

  viewTaskDetails(taskId: number): void {
  this.taskService.getTaskById(taskId).subscribe((task) => {
    this.taskDetails = task; // Save the retrieved task details
    this.showTaskDetailsModal = true; // Open the modal
  });
}

closeTaskDetailsModal(): void {
  this.showTaskDetailsModal = false; // Close the modal
}

  isOverdue(dueDate: string): boolean {
    return new Date(dueDate) < new Date();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getTasks();
    }
  }
    // Navigate to the user profile page with the userId
    navigateToProfile(): void {
      this.userId=sessionStorage.getItem('userId');
      if (this.userId) {
        this.router.navigate([`/profile/${this.userId}`]);  // Pass userId as part of the URL
      } else {
        console.error('User ID not found');
      }
    }
}
