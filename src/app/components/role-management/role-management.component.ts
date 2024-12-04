// src/app/components/role-management/role-management.component.ts
import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role.service';  // Corrected path for RoleService

// Define Role type
interface Role {
  roleName: string;
}

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent implements OnInit {
  roles: Role[] = [];  // Use the Role type for better type checking
  newRoleName: string = '';

  constructor(private roleService: RoleService) {}

  ngOnInit() {
    // Fetch roles on component load
    this.roleService.getAllRoles().subscribe(
      (roles: Role[]) => {  // Define the response type for better type safety
        this.roles = roles;
      },
      (error) => {
        console.error('Error fetching roles', error);
      }
    );
  }

  createRole() {
    if (this.newRoleName.trim()) {
      const role: Role = { roleName: this.newRoleName };  // Define role type
      this.roleService.createRole(role).subscribe(
        (response) => {
          console.log('Role created:', response);
          this.roles.push(response);  // Add the new role to the list
          this.newRoleName = '';  // Clear the input field
        },
        (error) => {
          console.error('Error creating role', error);
        }
      );
    }
  }
}
