import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryAccommodationComponent } from './summary-accommodation.component';

describe('SummaryAccommodationComponent', () => {
  let component: SummaryAccommodationComponent;
  let fixture: ComponentFixture<SummaryAccommodationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryAccommodationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryAccommodationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
