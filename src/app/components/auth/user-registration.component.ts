import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  firstName: string = '';
  lastName: string = '';
  errorMessage: string | null = null;
  passwordMismatch: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  // This method checks if the passwords match
  checkPasswordMismatch() {
    this.passwordMismatch = this.password !== this.confirmPassword;
  }

  register() {
    // Check if passwords match right before registration
    this.checkPasswordMismatch();

    // If passwords don't match, prevent registration
    if (this.passwordMismatch) {
      return;
    }

    // Call the registration service if passwords match
    this.authService.register(this.email, this.password, this.firstName, this.lastName).subscribe(
      (response) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/login']); // Redirect to login after successful registration
      },
      (error) => {
        console.error('Registration error', error);
        if (error.status === 400) {
          this.errorMessage = error.error.message || 'User with this email already exists.';
          this.clearSensitiveFields(); // Clear email and password on failure
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
          this.clearSensitiveFields();
        }
      }
    );
  }

  clearSensitiveFields() {
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }

  closePopup() {
    this.errorMessage = null;
  }

  // Navigate to the login page
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
