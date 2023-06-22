import { TestBed } from '@angular/core/testing';

import { IncapacidadesRadicadasCptService } from './incapacidades-radicadas-cpt.service';

describe('IncapacidadesRadicadasCptService', () => {
  let service: IncapacidadesRadicadasCptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncapacidadesRadicadasCptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
