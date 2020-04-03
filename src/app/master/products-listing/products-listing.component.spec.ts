import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsListingComponent } from './products-listing.component';

describe('ProductsListingComponent', () => {
  let component: ProductsListingComponent;
  let fixture: ComponentFixture<ProductsListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
