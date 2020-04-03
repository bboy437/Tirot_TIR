import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrderListingComponent } from './production-order-listing.component';

describe('ProductionOrderListingComponent', () => {
  let component: ProductionOrderListingComponent;
  let fixture: ComponentFixture<ProductionOrderListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionOrderListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionOrderListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
