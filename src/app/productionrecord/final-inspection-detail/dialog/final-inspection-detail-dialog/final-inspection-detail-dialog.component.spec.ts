import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalInspectionDetailDialogComponent } from './final-inspection-detail-dialog.component';

describe('FinalInspectionDetailDialogComponent', () => {
  let component: FinalInspectionDetailDialogComponent;
  let fixture: ComponentFixture<FinalInspectionDetailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalInspectionDetailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalInspectionDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
