import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeListingComponent } from './grade-listing.component';

describe('GradeListingComponent', () => {
  let component: GradeListingComponent;
  let fixture: ComponentFixture<GradeListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GradeListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
