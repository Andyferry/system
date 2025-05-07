import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiketbackComponent } from './tiketback.component';

describe('TiketbackComponent', () => {
  let component: TiketbackComponent;
  let fixture: ComponentFixture<TiketbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiketbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiketbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
