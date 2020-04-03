import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftSchduleListingComponent } from './shift-schdule-listing.component';

describe('ShiftSchduleListingComponent', () => {
  let component: ShiftSchduleListingComponent;
  let fixture: ComponentFixture<ShiftSchduleListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftSchduleListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftSchduleListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
