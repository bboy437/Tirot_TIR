import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPlaningEntryComponent } from './production-planing-entry.component';

describe('ProductionPlaningEntryComponent', () => {
  let component: ProductionPlaningEntryComponent;
  let fixture: ComponentFixture<ProductionPlaningEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionPlaningEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionPlaningEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
