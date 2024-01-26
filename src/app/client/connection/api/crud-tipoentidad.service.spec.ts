import { TestBed } from '@angular/core/testing';

import { CrudTipoentidadService } from './crud-tipoentidad.service';

describe('CrudTipoentidadService', () => {
  let service: CrudTipoentidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudTipoentidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
