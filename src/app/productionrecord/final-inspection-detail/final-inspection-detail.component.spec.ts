import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalInspectionDetailComponent } from './final-inspection-detail.component';

describe('FinalInspectionDetailComponent', () => {
  let component: FinalInspectionDetailComponent;
  let fixture: ComponentFixture<FinalInspectionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalInspectionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalInspectionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
