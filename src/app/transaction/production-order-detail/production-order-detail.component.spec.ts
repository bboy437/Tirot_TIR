import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrderDetailComponent } from './production-order-detail.component';

describe('ProductionOrderDetailComponent', () => {
  let component: ProductionOrderDetailComponent;
  let fixture: ComponentFixture<ProductionOrderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionOrderDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
