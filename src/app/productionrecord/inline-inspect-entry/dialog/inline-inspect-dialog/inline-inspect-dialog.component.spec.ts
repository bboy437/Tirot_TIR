import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineInspectDialogComponent } from './inline-inspect-dialog.component';

describe('InlineInspectDialogComponent', () => {
  let component: InlineInspectDialogComponent;
  let fixture: ComponentFixture<InlineInspectDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InlineInspectDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineInspectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
