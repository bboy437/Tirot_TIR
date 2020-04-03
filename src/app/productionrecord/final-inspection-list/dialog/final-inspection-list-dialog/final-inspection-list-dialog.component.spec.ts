import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalInspectionListDialogComponent } from './final-inspection-list-dialog.component';

describe('FinalInspectionListDialogComponent', () => {
  let component: FinalInspectionListDialogComponent;
  let fixture: ComponentFixture<FinalInspectionListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalInspectionListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalInspectionListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
