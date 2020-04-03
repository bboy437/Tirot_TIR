import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPlanDetailComponent } from './production-plan-detail.component';

describe('ProductionPlanDetailComponent', () => {
  let component: ProductionPlanDetailComponent;
  let fixture: ComponentFixture<ProductionPlanDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionPlanDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionPlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
