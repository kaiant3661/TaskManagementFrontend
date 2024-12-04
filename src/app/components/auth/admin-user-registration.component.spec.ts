import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserRegistrationComponent } from './admin-user-registration.component';

describe('AdminUserRegistrationComponent', () => {
  let component: AdminUserRegistrationComponent;
  let fixture: ComponentFixture<AdminUserRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUserRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
