import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizadorDocumentoComponent } from './visualizador-documento.component';

describe('VisualizadorDocumentoComponent', () => {
  let component: VisualizadorDocumentoComponent;
  let fixture: ComponentFixture<VisualizadorDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizadorDocumentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizadorDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
