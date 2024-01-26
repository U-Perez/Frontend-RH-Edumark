import { TestBed } from '@angular/core/testing';

import { LoginEmpleadoService } from './login-empleado.service';

describe('LoginEmpleadoService', () => {
  let service: LoginEmpleadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginEmpleadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
