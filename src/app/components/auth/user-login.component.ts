import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserProfileService } from '../../services/user-profile.service'; // Import the UserProfileService

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  userRole: string | null = '';  // Define the userRole variable here
  userId: string;
  isDeleted: boolean = false;  // Initialize isDeleted to false
  showSprinkles: boolean = false;
  sprinkles: any[] = [];
  constructor(
    private authService: AuthService,
    private router: Router,
    private userProfileService: UserProfileService // Inject UserProfileService
  ) {}

  login() {
    // Ensure fields are not empty
    if (!this.email || !this.password) {
      alert('Email and password are required.'); // Show popup
      return;
    }

    // Call login service
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        sessionStorage.setItem('token', response.token); // Save JWT token
        this.userRole = sessionStorage.getItem('user_role'); // Get the user role from sessionStorage
        this.userId = this.authService.getUserId(); // Get the user ID

        // Fetch user profile and check if the account is deleted
        this.userProfileService.getUserProfile(this.userId).subscribe(
          (user) => {
            this.isDeleted = user.isDeleted; // Check if the account is deleted

            if (this.isDeleted) {
              alert('Your account has been Deactivated. Please contact support.');
              return; // Stop the login process if the account is deleted
            }
            this.triggerSprinkles();
            // Check user role after confirming the account is not deleted
            if (this.userRole === 'Admin') {
              this.router.navigate(['/audit-logs']);  // Redirect Admin to Audit Logs
            } else if (this.userRole === 'New') {
              alert('Welcome!\n\nAs soon as your account is registered, you will be able to access this application.');
            } else {
              this.router.navigate(['/dashboard']);  // Redirect other users to Dashboard
            }
          },
          (error) => {
            console.error('Error fetching user profile', error);
            alert('An error occurred while checking account status.');
          }
        );
      },
      (error) => {
        console.error('Login error', error);
        if (error.status === 401) {
          alert('Invalid email or password.'); // Popup for invalid credentials
        } else {
          alert('An error occurred. Please try again later.');
        }
      }
    );
  }




  triggerSprinkles() {
    this.showSprinkles = true;
    this.sprinkles = Array.from({ length: 100 }).map(() => ({
      style: {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        backgroundColor: this.getRandomColor()
      }
    }));

    // Hide sprinkles after animation ends
    setTimeout(() => {
      this.showSprinkles = false;
    }, 1000);
  }

  getRandomColor() {
    const colors = ['#ffc107', '#ff5722', '#4caf50', '#2196f3', '#e91e63'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
