import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service'; // Import RoleService
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-user-registration',
  templateUrl: './admin-user-registration.component.html',
  styleUrls: ['./admin-user-registration.component.css']
})
export class AdminUserRegistrationComponent implements OnInit {
  user: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleId: null
  };

  confirmPassword: string = ''; // For matching password confirmation
  roles: any[] = []; // List of roles to populate the dropdown
  currentDate: Date = new Date();
  userId: string;  // Store the userId for navigation
  
  // Error message for form validation
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRoles(); // Load roles when the component is initialized
  }

  // Load roles from RoleService
  loadRoles(): void {
    this.roleService.getAllRoles().subscribe(
      (roles: any[]) => {
        this.roles = roles;
      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );
  }

  // Handle user registration
  registerUser(): void {
    this.errorMessage = ''; // Reset error message

    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = 'Password and Confirm Password do not match.';
      return;
    }

    if (!this.user.firstName || !this.user.lastName || !this.user.email || !this.user.password || !this.user.roleId) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    const userData = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      passwordHash: this.user.password, // Assuming the password is being sent as passwordHash
      roleId: this.user.roleId
    };

    // Call the service to register the user
    this.userService.registerUser(userData).subscribe(
      (response) => {
        console.log('User registered successfully:', response);
        this.router.navigate(['/audit-logs'])
      },
      (error) => {
        console.error('Error registering user:', error);
        this.errorMessage = 'Error registering user. Please try again later.';
      }
    );
  }

  navigateToProfile(): void {
    this.userId = sessionStorage.getItem('userId');
    if (this.userId) {
      this.router.navigate([`/profile/${this.userId}`]);  // Pass userId as part of the URL
    } else {
      console.error('User ID not found');
    }
  }
}
