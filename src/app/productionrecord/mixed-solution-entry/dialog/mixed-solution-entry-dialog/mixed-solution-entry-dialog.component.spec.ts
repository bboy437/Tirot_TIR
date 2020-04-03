import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MixedSolutionEntryDialogComponent } from './mixed-solution-entry-dialog.component';

describe('MixedSolutionEntryDialogComponent', () => {
  let component: MixedSolutionEntryDialogComponent;
  let fixture: ComponentFixture<MixedSolutionEntryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MixedSolutionEntryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MixedSolutionEntryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
