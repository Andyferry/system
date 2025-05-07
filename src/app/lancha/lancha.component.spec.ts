import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanchaComponent } from './lancha.component';

describe('LanchaComponent', () => {
  let component: LanchaComponent;
  let fixture: ComponentFixture<LanchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanchaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
