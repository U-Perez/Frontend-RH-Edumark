import { TestBed } from '@angular/core/testing';

import { LoginEntidadService } from './login-entidad.service';

describe('LoginEntidadService', () => {
  let service: LoginEntidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginEntidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
