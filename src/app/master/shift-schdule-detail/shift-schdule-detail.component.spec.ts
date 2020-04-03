import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftSchduleDetailComponent } from './shift-schdule-detail.component';

describe('ShiftSchduleDetailComponent', () => {
  let component: ShiftSchduleDetailComponent;
  let fixture: ComponentFixture<ShiftSchduleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftSchduleDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftSchduleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
