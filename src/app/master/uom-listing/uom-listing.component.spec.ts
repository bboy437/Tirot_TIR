import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UomListingComponent } from './uom-listing.component';

describe('UomListingComponent', () => {
  let component: UomListingComponent;
  let fixture: ComponentFixture<UomListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UomListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UomListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
