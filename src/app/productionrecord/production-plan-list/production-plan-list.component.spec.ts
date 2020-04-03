import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPlanListComponent } from './production-plan-list.component';

describe('ProductionPlanListComponent', () => {
  let component: ProductionPlanListComponent;
  let fixture: ComponentFixture<ProductionPlanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionPlanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
