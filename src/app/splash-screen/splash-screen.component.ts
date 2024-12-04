// splash-screen.component.ts
import { Component, OnInit } from '@angular/core';
import { SplashScreenService } from '../services/splash-screen.service';  // Import the service

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css']
})
export class SplashScreenComponent implements OnInit {
  showSplash: boolean = false;  // Track whether the splash screen should be shown

  constructor(private splashScreenService: SplashScreenService) {}

  ngOnInit() {
    // Subscribe to the showSplashScreen$ observable to listen for changes
    this.splashScreenService.showSplashScreen$.subscribe((state) => {
      this.showSplash = state;  // Update the local variable based on emitted value
    });
  }
}
