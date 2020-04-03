import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationListingComponent } from './station-listing.component';

describe('StationListingComponent', () => {
  let component: StationListingComponent;
  let fixture: ComponentFixture<StationListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
