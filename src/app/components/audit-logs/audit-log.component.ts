import { Component, OnInit } from '@angular/core';
import { AuditLogService } from '../../services/audit-log.service';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.css']
})
export class AuditLogComponent implements OnInit {
  auditLogs: any[] = [];
  errorMessage: string = '';
  searchDate: string = ''; // For date picker
  searchTerm: string = ''; // For action search
  showPopup: boolean = false; // For confirmation popup
  currentDate: Date = new Date();
  userId: string;  // Store the userId for navigation
  
  constructor( private router: Router,private auditLogService: AuditLogService,private authService: AuthService) {
    this.userId=authService.getUserId();
  }

  ngOnInit(): void {
    this.loadAllLogs();
  // Fetch userId from localStorage

  }

  // Load all logs
  loadAllLogs(): void {
    this.auditLogService.getAllAuditLogs()
      .subscribe(
        (logs) => this.auditLogs = logs,
        (error) => this.handleError('Failed to fetch audit logs.', error)
      );
  }

  // Perform search
  searchLogs(): void {
    if (this.searchDate && this.searchTerm) {
      // Step 1: Filter by date
      this.auditLogService.searchLogsByDate(this.searchDate)
        .subscribe(
          (logs) => {
            // Step 2: Further filter by action locally
            this.auditLogs = logs.filter(log =>
              log.action.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
          },
          (error) => this.handleError('Failed to search logs by date.', error)
        );
    } else if (this.searchDate) {
      // Search by date only
      this.auditLogService.searchLogsByDate(this.searchDate)
        .subscribe(
          (logs) => this.auditLogs = logs,
          (error) => this.handleError('Failed to search logs by date.', error)
        );
    } else if (this.searchTerm) {
      // Search by action only
      this.auditLogService.searchLogsByAction(this.searchTerm)
        .subscribe(
          (logs) => this.auditLogs = logs,
          (error) => this.handleError('Failed to search logs by action.', error)
        );
    } else {
      // If no filters are provided, reload all logs
      this.loadAllLogs();
    }
  }

  // Confirm clear logs
  confirmClearLogs(): void {
    this.showPopup = true;
  }

  // Clear all logs
  clearAllLogs(): void {
    this.auditLogService.clearAllLogs()
      .subscribe(
        () => {
          this.showPopup = false;
          this.loadAllLogs();
        },
        (error) => this.handleError('Failed to clear logs.', error)
      );
  }

  cancelPopup(): void {
    this.showPopup = false;
  }

  private handleError(message: string, error: any): void {
    this.errorMessage = message;
    console.error(error);
  }

  // Navigate to the user profile page with the userId
  navigateToProfile(): void {
    this.userId=localStorage.getItem('userId');
    if (this.userId) {
      this.router.navigate([`/profile/${this.userId}`]);  // Pass userId as part of the URL
    } else {
      console.error('User ID not found');
    }
  }

}
