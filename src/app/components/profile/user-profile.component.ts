import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { UserProfileService } from '../../services/user-profile.service';
import { RoleService } from '../../services/role.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userId: string;
  userProfile: User;
  isEditMode: boolean = false;
  confirmPassword: string = '';
  newPassword: string = '';
  userRole: string = '';
  roles: any[] = [];
  currentDate: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private userProfileService: UserProfileService,
    private roleService: RoleService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    this.userRole = localStorage.getItem('user_role');
    this.loadUserProfile();
    if (this.userRole === 'Admin') {
      this.loadRoles();
    }
  }

  loadUserProfile(): void {
    this.userProfileService.getUserProfile(this.userId).subscribe(
      (response: User) => {
        this.userProfile = response;
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }

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

  enableEditMode(): void {
    this.isEditMode = true;
    this.newPassword = '';
    this.confirmPassword = '';
  }

  
  saveUserProfile(): void {
    if (this.newPassword && this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    if (this.newPassword && this.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
  
    this.userProfile.passwordHash = this.newPassword || null;
    
    this.userProfileService.updateUserProfile(this.userProfile).subscribe(
      (response: User) => {
        this.userProfile = response;
  
        if (this.userId === localStorage.getItem('userId')) {
          const role = this.roles.find((r) => r.roleId === this.userProfile.roleId);
         localStorage.setItem('user_role', role ? role.roleName || '' : '');

        }
        
  
        this.isEditMode = false;
        alert('Profile updated successfully!');
      },
      (error) => {
        console.error('Error updating profile:', error);
      }
    );
  }

  
  

  cancelEditMode(): void {
    this.isEditMode = false;
    this.loadUserProfile();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Navigate to the login component
  }


  // Navigate to the dashbaord
  navigateDashboard(): void {
   
      if (this.userRole === 'Admin') {
        this.router.navigate(['/audit-logs'])
      }
        else{
          this.router.navigate(['/dashboard']);
         }
       // Pass userId as part of the URL
 
 
    }
}
