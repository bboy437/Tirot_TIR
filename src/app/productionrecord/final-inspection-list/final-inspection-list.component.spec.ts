import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalInspectionListComponent } from './final-inspection-list.component';

describe('FinalInspectionListComponent', () => {
  let component: FinalInspectionListComponent;
  let fixture: ComponentFixture<FinalInspectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalInspectionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalInspectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
