
import { UserService } from '../../services/user.service'; // Import the user service
import { TaskService } from '../../services/task.service'; // Import the task service
import { RoleService } from '../../services/role.service'; // Import the role service
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'; // For the pop-up dialog
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { UserProfileService } from '../../services/user-profile.service';
import { User } from '../../models/user.model'; // Adjust the import path to your actual User model
import { ChangeDetectorRef } from '@angular/core';  // Import ChangeDetectorRef
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @ViewChild('registrationPopup') registrationPopup!: TemplateRef<any>;

  users: any[] = [];  // Array to store all users
  newUsers: any[] = [];  // Array to store users with role 'New'
  nonNewUsers: any[] = [];  // Array to store non-'New' users
  totalTasksCount: number = 0;
  completedTasksCount: number = 0;
  pendingTasksCount: number = 0;
  inProgressTasksCount: number = 0;
  selectedUser: any;

  currentDate: Date = new Date();
  userId: string;  // Store the userId for navigation
  

  constructor(
 // Inject the dialog service
 
    private cdr: ChangeDetectorRef  ,
    private userProfileService: UserProfileService,
    private userService: UserService,
    private taskService: TaskService,
    private roleService: RoleService,
  
    public dialog: MatDialog ,
    private router: Router,
    private authService: AuthService,
    // Inject the dialog service
  ) {this.userId=authService.getUserId();}

  ngOnInit(): void {
    this.getAllUsers();
    this.loadRoles();
  }
  
  getAllUsers(): void {
    this.userService.getallUsers().subscribe(
      (users: any[]) => {
        this.users = users;
        this.filterUsersByRole();  // Apply filters
        this.users.forEach(user => {
          this.getTasks(user.userId);  // Fetch tasks for each user individually
        });
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  }
  
  
  // Filter users based on their role
  filterUsersByRole(): void {
    this.newUsers = this.users.filter(user => user.role.roleName === 'New');
    this.nonNewUsers = this.users.filter(user => user.role.roleName !== 'New');
  }

  // Navigate to user profile
  navigateToProfile(userId: string): void {
    this.router.navigate([`/profile/${userId}`]);
  }

  // Open the dialog for user registration (new users)
  openRegisterDialog(user: any): void {
    this.selectedUser = user;
    const dialogRef = this.dialog.open(RegisterDialogComponent, {
      width: '400px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      // Handle registration logic if necessary
    });
  }

  // Get tasks for the current user and calculate task counts
  getTasks(userId: string): void {
    this.taskService.getUserTaskss(userId).subscribe(tasks => {
      // Calculate tasks for the specific user
      const totalTasksCount = tasks.length;
      const pendingTasksCount = tasks.filter(task => task.status === 'Pending').length;
      const completedTasksCount = tasks.filter(task => task.status === 'Completed').length;
      const inProgressTasksCount = tasks.filter(task => task.status === 'InProgress').length;
  
      // Update the respective user object with task counts
      const user = this.users.find(u => u.userId === userId);
      if (user) {
        user.totalTasksCount = totalTasksCount;
        user.pendingTasksCount = pendingTasksCount;
        user.completedTasksCount = completedTasksCount;
        user.inProgressTasksCount = inProgressTasksCount;
      }
    });
  }
  
  
  

  // Load all roles to check if the user is new or not
  loadRoles(): void {
    this.roleService.getAllRoles().subscribe(
      (roles: any[]) => {
        console.log('Roles:', roles);
      },
      error => {
        console.error('Error fetching roles:', error);
      }
    );
  }

  openRegistrationPopup(): void {
    this.dialog.open(this.registrationPopup);
  }

  registerUser(user: User): void {
    // Update user role to 'User' (roleId = 3)
    const updatedUser: Partial<User> = {
      userId: user.userId,
      firstName:user.firstName,
      lastName:user.lastName,
      email:user.email,
      password:null,
      roleId: 1
    };

    this.userProfileService.updateUserProfile(updatedUser).subscribe(
      (updatedProfile: User) => {
        // Update local state
        user.role.roleName = 'User';
        this.newUsers = this.newUsers.filter(u => u !== user);
        this.nonNewUsers.push(user);
        console.log('User registered:', updatedProfile);
      },
      error => console.error('Error updating user role:', error)
    );
  }


  cancelUser(user: any): void {
    this.userService.deleteUser(user.userId).pipe(
      switchMap(() => this.userService.getallUsers())
    ).subscribe(
      (users: any[]) => {
        this.users = [...users];
        this.filterUsersByRole();
        this.cdr.detectChanges(); // Trigger change detection
        console.log('User deleted and list refreshed:', user);
      },
      error => console.error('Error deleting user or refreshing list:', error)
    );
  }
  
  
  closeDialog(): void {
    this.dialog.closeAll();
  }

  navigateToYourProfile(): void {
    this.userId=sessionStorage.getItem('userId');
    if (this.userId) {
      this.router.navigate([`/profile/${this.userId}`]);  // Pass userId as part of the URL
    } else {
      console.error('User ID not found');
    }
  }


  enableDisableUser(user: any): void {
    if (user.isDeleted) {
      this.restoreUser(user.userId);
    } else {
      this.softDeleteUser(user.userId);
    }
  }

  softDeleteUser(userId: number): void {
    this.userService.softDeleteUser(userId).pipe(
      switchMap(() => this.userService.getallUsers())
    ).subscribe(
      (users: any[]) => {
        this.users = users;
        this.filterUsersByRole();
        this.cdr.detectChanges();
        console.log('User soft deleted and list refreshed');
      },
      error => console.error('Error soft deleting user:', error)
    );
  }

  restoreUser(userId: number): void {
    this.userService.restoreUser(userId).pipe(
      switchMap(() => this.userService.getallUsers())
    ).subscribe(
      (users: any[]) => {
        this.users = users;
        this.filterUsersByRole();
        this.cdr.detectChanges();
        console.log('User restored and list refreshed');
      },
      error => console.error('Error restoring user:', error)
    );
  }
// In UsersComponent
getTenure(createdAt: string): string {
  const currentDate = new Date();
  const joinDate = new Date(createdAt);

  const years = currentDate.getFullYear() - joinDate.getFullYear();
  const months = currentDate.getMonth() - joinDate.getMonth();
  const days = currentDate.getDate() - joinDate.getDate();

  // Adjust for negative month or day values
  const adjustedMonths = months < 0 ? 12 + months : months;
  const adjustedDays = days < 0 ? new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate() + days : days;

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ${adjustedMonths > 0 ? `${adjustedMonths} month${adjustedMonths > 1 ? 's' : ''}` : ''}`;
  } else if (adjustedMonths > 0) {
    return `${adjustedMonths} month${adjustedMonths > 1 ? 's' : ''} ${adjustedDays > 0 ? `${adjustedDays} day${adjustedDays > 1 ? 's' : ''}` : ''}`;
  } else {
    return `${adjustedDays} day${adjustedDays > 1 ? 's' : ''}`;
  }
}

}
