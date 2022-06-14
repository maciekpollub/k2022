import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryOtherAccommodationComponent } from './summary-other-accommodation.component';

describe('SummaryOtherAccommodationComponent', () => {
  let component: SummaryOtherAccommodationComponent;
  let fixture: ComponentFixture<SummaryOtherAccommodationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryOtherAccommodationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryOtherAccommodationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
