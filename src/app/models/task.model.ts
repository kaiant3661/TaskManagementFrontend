// src/app/models/task.model.ts

export interface Task {
  taskId?: number;
    taskName: string;
    description?: string;
    status: string;
    priority: string;
    assignedToUserId: number;
    createdByUserId: number;
    dueDate: string;
  }
  