import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineInspectEntryComponent } from './inline-inspect-entry.component';

describe('InlineInspectEntryComponent', () => {
  let component: InlineInspectEntryComponent;
  let fixture: ComponentFixture<InlineInspectEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InlineInspectEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineInspectEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
