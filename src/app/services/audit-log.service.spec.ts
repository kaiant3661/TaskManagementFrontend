import { TestBed, inject } from '@angular/core/testing';

import { AuditLogService } from './audit-log.service';

describe('AuditLogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuditLogService]
    });
  });

  it('should be created', inject([AuditLogService], (service: AuditLogService) => {
    expect(service).toBeTruthy();
  }));
});
