import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationGroupListingComponent } from './stationgroup-listing.component';

describe('StationgroupListingComponent', () => {
  let component: StationGroupListingComponent;
  let fixture: ComponentFixture<StationGroupListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationGroupListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationGroupListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
