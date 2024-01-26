import { TestBed } from '@angular/core/testing';

import { CrudGiroService } from './crud-giro.service';

describe('CrudGiroService', () => {
  let service: CrudGiroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudGiroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
