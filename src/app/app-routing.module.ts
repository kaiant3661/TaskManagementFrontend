// src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/user-login.component';
import { UserRegistrationComponent } from './components/auth/user-registration.component';  // Correct path
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserProfileComponent } from './components/profile/user-profile.component';
import { TaskManagementComponent } from './components/task-management/task-management.component';
import { AuditLogComponent } from './components/audit-logs/audit-log.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleManagementComponent} from './components/role-management/role-management.component';// Import Role Management
import { UsersComponent } from './components/users/users.component'; // Import the UsersComponent

import { AdminUserRegistrationComponent } from './components/auth/admin-user-registration.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: UserRegistrationComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'tasks', component: TaskManagementComponent, canActivate: [AuthGuard] },
  { path: 'audit-logs', component: AuditLogComponent, canActivate: [AuthGuard] },
  { path: 'roles', component:  RoleManagementComponent, canActivate: [AuthGuard] },  // Add route for Role Management
  { path: 'admin-register', component: AdminUserRegistrationComponent },  // Route for Admin User Registration
  { path: 'users', component: UsersComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
