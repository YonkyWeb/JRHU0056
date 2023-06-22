import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncapacidadesRadicadasCptComponent } from './incapacidades-radicadas-cpt.component';

describe('IncapacidadesRadicadasCptComponent', () => {
  let component: IncapacidadesRadicadasCptComponent;
  let fixture: ComponentFixture<IncapacidadesRadicadasCptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncapacidadesRadicadasCptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncapacidadesRadicadasCptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
