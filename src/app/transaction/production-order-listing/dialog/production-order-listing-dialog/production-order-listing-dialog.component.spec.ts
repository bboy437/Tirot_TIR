import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrderListingDialogComponent } from './production-order-listing-dialog.component';

describe('ProductionOrderListingDialogComponent', () => {
  let component: ProductionOrderListingDialogComponent;
  let fixture: ComponentFixture<ProductionOrderListingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionOrderListingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionOrderListingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
