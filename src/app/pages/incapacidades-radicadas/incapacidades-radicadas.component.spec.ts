import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncapacidadesRadicadasComponent } from './incapacidades-radicadas.component';

describe('IncapacidadesRadicadasComponent', () => {
  let component: IncapacidadesRadicadasComponent;
  let fixture: ComponentFixture<IncapacidadesRadicadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncapacidadesRadicadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncapacidadesRadicadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
