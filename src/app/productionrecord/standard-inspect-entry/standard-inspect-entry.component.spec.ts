import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardInspectEntryComponent } from './standard-inspect-entry.component';

describe('StandardInspectEntryComponent', () => {
  let component: StandardInspectEntryComponent;
  let fixture: ComponentFixture<StandardInspectEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardInspectEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardInspectEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
