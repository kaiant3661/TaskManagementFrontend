import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../../models/task.model';  // Import the Task interface

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent {
  @Input() task: Task;  // Input for passing task data
  @Output() close = new EventEmitter<void>();  // Output event to close the modal

  closePopup() {
    this.close.emit();  // Emit close event when the button is clicked
  }
}
