import { TestBed } from '@angular/core/testing';

import { VisualizadorDocumentoService } from './visualizador-documento.service';

describe('VisualizadorDocumentoService', () => {
  let service: VisualizadorDocumentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisualizadorDocumentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
