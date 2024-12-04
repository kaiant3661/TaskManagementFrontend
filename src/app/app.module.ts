  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { HttpClientModule } from '@angular/common/http';  // For HTTP requests
  import { AppRoutingModule } from './app-routing.module';  // Routes configuration
  import { AppComponent } from './app.component';

  import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


  // Import your components
  import { LoginComponent } from './components/auth/user-login.component';
  import { UserRegistrationComponent } from './components/auth/user-registration.component';
  import { DashboardComponent } from './components/dashboard/dashboard.component';
  import { UserProfileComponent } from './components/profile/user-profile.component';
  import { TaskManagementComponent } from './components/task-management/task-management.component';
  import { AuditLogComponent } from './components/audit-logs/audit-log.component';
  import { RoleManagementComponent } from './components/role-management/role-management.component';
  import { MatButtonModule } from '@angular/material/button';

  // Import your services
  import { MatDialogModule } from '@angular/material/dialog';

  import { UserService } from './services/user.service';
  import { AuthService } from './services/auth.service';
  import { AuditLogService } from './services/audit-log.service';
  import { TaskService } from './services/task.service';
  import { AuthGuard } from './guards/auth.guard';
  import { RoleService } from './services/role.service';
  import { AdminUserRegistrationComponent } from './components/auth/admin-user-registration.component';
  import { MatIconModule } from '@angular/material';
  import { UserProfileService } from './services/user-profile.service';
  import { TaskDetailsComponent } from './components/task-management/task-details/task-details.component';
  import { NavbarComponent } from './components/navbar/navbar.component';
  import { NgSelectModule } from '@ng-select/ng-select';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddTaskComponent } from './components/task-management/add-task/add-task.component';
import { UsersComponent } from './components/users/users.component';
import {RegisterDialogComponent } from './components/register-dialog/register-dialog.component';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { SplashScreenService } from './services/splash-screen.service';
  @NgModule({
    declarations: [
      AppComponent,
      LoginComponent,
      UserRegistrationComponent,
      DashboardComponent,
      UserProfileComponent,
      TaskManagementComponent,
      AuditLogComponent,
      RoleManagementComponent,
      AdminUserRegistrationComponent,
      TaskDetailsComponent,
      NavbarComponent,
      AddTaskComponent,
      UsersComponent,
      RegisterDialogComponent,
      SplashScreenComponent,
    ],
    imports: [
      MatButtonModule,
      BrowserAnimationsModule, 
      NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
      BrowserModule,
      MatDialogModule,
      HttpClientModule,  // For HTTP client
      AppRoutingModule , // Import the routing module
      MatIconModule //,  
    ],
    providers: [
      SplashScreenService,
      UserService,  // Register the service
      AuthService,  // Register the service
      AuditLogService,  // Register the service
      TaskService,  // Register the service
      AuthGuard , // Register the AuthGuard for route protection
      RoleService,
      UserProfileService
    ],
    bootstrap: [AppComponent]  // Root component of the application
  })
  export class AppModule { }
