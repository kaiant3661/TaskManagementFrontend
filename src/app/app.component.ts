import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreenService } from './services/splash-screen.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  showSplash: boolean = true; // Controls splash visibility
  isLoggedIn: boolean = false; // Tracks user login status
  userId: string | null = null; // Stores user ID
  userRole: string | null = null; // Stores user role

  constructor(
    private splashScreenService: SplashScreenService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if the splash screen has already been shown during the current session
    const hasShownSplash = sessionStorage.getItem('hasShownSplash');
    console.log('hasShownSplash:', hasShownSplash);  // Log for debugging
    
    if (!hasShownSplash) {
      // Show splash screen for the first time
      this.showSplash = true;
      
      // Show splash screen for 4 seconds
      setTimeout(() => {
        this.showSplash = false;
        this.splashScreenService.hide(); // Hide splash screen after 4 seconds
        sessionStorage.setItem('hasShownSplash', 'true');  // Mark splash screen as shown for this session
        this.navigateBasedOnAuth();
      }, 4000);  // Show splash for 4 seconds
    } else {
      // Skip splash screen for subsequent loads in the same session
      this.showSplash = false;
      this.splashScreenService.hide();  // Immediately hide splash screen
      this.navigateBasedOnAuth();  // Navigate based on authentication status
    }
  }

  async navigateBasedOnAuth() {
    // Get the login status and user role
    this.isLoggedIn = this.authService.isAuthenticated();  // Assuming this returns a boolean
    this.userRole = this.authService.getUserrole();  // Assuming this returns a string or null

    // Check if the user is logged in
    if (!this.isLoggedIn) {
      await this.router.navigate(['/login']);  // Navigate to login if not logged in
    } else {
      if (this.userRole == null) {
        // If user role is null, redirect to login
        await this.router.navigate(['/login']);
      } else if (this.userRole === 'New') {
        // If the user role is 'New', show an alert and don't navigate
        await this.router.navigate(['/login']);
        alert('You are not registered yet.');
      } else if (this.userRole === 'Admin') {
        // If the user role is 'Admin', navigate to the audit logs page
        await this.router.navigate(['/audit-logs']);
      } else if (this.userRole === 'User') {
        // If the user role is 'User', navigate to the dashboard
        await this.router.navigate(['/dashboard']);
      } else {
        // Optional: Handle unexpected roles
        console.warn('Unexpected user role:', this.userRole);
        await this.router.navigate(['/login']);
      }
    }
  }

  

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userId = null;
    sessionStorage.removeItem('hasShownSplash');  // Reset splash screen state on logout
    this.router.navigate(['/login']);
  }
}
