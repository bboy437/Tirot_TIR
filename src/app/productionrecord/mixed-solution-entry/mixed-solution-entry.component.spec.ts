import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MixedSolutionEntryComponent } from './mixed-solution-entry.component';

describe('MixedSolutionEntryComponent', () => {
  let component: MixedSolutionEntryComponent;
  let fixture: ComponentFixture<MixedSolutionEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MixedSolutionEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MixedSolutionEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
