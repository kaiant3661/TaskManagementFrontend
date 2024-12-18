import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.css']
})
export class RegisterDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  // Handle the registration logic here
  registerUser(): void {
    console.log('Registering user:', this.data);
    // Add logic for user registration
  }
}
