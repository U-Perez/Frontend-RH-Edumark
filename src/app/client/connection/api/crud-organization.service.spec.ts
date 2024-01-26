import { TestBed } from '@angular/core/testing';

import { CrudOrganizationService } from './CrudOrganizationService';

describe('CrudOrganizationService', () => {
  let service: CrudOrganizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudOrganizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
