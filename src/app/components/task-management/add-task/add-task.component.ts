import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { UserService } from '../../../services/user.service'; // Make sure to import your UserService

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})
export class AddTaskComponent implements OnInit {
  taskForm: FormGroup;
  users: any[] = [];  // Array to hold the list of users

  @Output() taskAdded = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserService  // Inject UserService
  ) {
    this.taskForm = this.fb.group({
      taskName: ['', Validators.required],
      dueDate: ['', Validators.required],
      assignedToUserId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Fetch the users when the component is initialized
    this.userService.getallUsers().subscribe((users) => {
      this.users = users;  // Store the users in the component
    });
  }

  saveTask(): void {
    if (this.taskForm.valid) {
      this.taskService.createTask(this.taskForm.value).subscribe({
        next: () => {
          console.log('Task saved successfully!');
          this.taskAdded.emit(); // Notify parent
        },
        error: (err) => console.error('Error saving task:', err),
      });
    }
  }

  closeModal(): void {
    this.close.emit(); // Notify parent to close the modal
  }
}
