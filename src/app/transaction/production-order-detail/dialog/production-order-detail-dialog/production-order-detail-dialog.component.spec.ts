import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrderDetailDialogComponent } from './production-order-detail-dialog.component';

describe('ProductionOrderDetailDialogComponent', () => {
  let component: ProductionOrderDetailDialogComponent;
  let fixture: ComponentFixture<ProductionOrderDetailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionOrderDetailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionOrderDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
