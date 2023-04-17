import { TestBed } from '@angular/core/testing';

import { InformacionIncapacidadService } from './informacion-incapacidad.service';

describe('InformacionIncapacidadService', () => {
  let service: InformacionIncapacidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformacionIncapacidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
