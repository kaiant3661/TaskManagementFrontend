import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject'; // In Angular 5, import from 'rxjs/Subject'

@Injectable()
export class SplashScreenService {
  private showSplashScreen = new Subject<boolean>();  // Subject to emit boolean values

  showSplashScreen$ = this.showSplashScreen.asObservable();  // Observable to subscribe to

  constructor() {}

  // Method to show splash screen
  show() {
    this.showSplashScreen.next(true);
  }

  // Method to hide splash screen
  hide() {
    this.showSplashScreen.next(false);
  }
}
