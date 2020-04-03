import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialListingComponent } from './raw-material-listing.component';

describe('RawMaterialListingComponent', () => {
  let component: RawMaterialListingComponent;
  let fixture: ComponentFixture<RawMaterialListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RawMaterialListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawMaterialListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
