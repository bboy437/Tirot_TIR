import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionRecordHeaderComponent } from './production-record-header.component';

describe('ProductionRecordHeaderComponent', () => {
  let component: ProductionRecordHeaderComponent;
  let fixture: ComponentFixture<ProductionRecordHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionRecordHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionRecordHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
