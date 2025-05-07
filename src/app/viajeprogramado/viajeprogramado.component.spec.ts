import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViajeprogramadoComponent } from './viajeprogramado.component';

describe('ViajeprogramadoComponent', () => {
  let component: ViajeprogramadoComponent;
  let fixture: ComponentFixture<ViajeprogramadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViajeprogramadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViajeprogramadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
