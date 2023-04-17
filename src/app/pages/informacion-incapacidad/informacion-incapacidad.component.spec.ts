import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionIncapacidadComponent } from './informacion-incapacidad.component';

describe('InformacionIncapacidadComponent', () => {
  let component: InformacionIncapacidadComponent;
  let fixture: ComponentFixture<InformacionIncapacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformacionIncapacidadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformacionIncapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
