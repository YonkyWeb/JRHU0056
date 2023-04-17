import { TestBed } from '@angular/core/testing';

import { IncapacidadesRadicadasService } from './incapacidades-radicadas.service';

describe('IncapacidadesRadicadasService', () => {
  let service: IncapacidadesRadicadasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncapacidadesRadicadasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
