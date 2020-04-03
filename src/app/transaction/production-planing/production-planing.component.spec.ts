import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPlaningComponent } from './production-planing.component';

describe('ProductionPlaningComponent', () => {
  let component: ProductionPlaningComponent;
  let fixture: ComponentFixture<ProductionPlaningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionPlaningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionPlaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
