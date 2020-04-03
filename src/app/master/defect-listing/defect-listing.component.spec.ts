import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectListingComponent } from './defect-listing.component';

describe('DefectListingComponent', () => {
  let component: DefectListingComponent;
  let fixture: ComponentFixture<DefectListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefectListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
