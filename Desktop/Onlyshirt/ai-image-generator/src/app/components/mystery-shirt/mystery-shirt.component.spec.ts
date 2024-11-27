import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysteryShirtComponent } from './mystery-shirt.component';

describe('MysteryShirtComponent', () => {
  let component: MysteryShirtComponent;
  let fixture: ComponentFixture<MysteryShirtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MysteryShirtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MysteryShirtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
