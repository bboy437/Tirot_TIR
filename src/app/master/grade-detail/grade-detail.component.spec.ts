import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeDetailComponent } from './grade-detail.component';

describe('GradeDetailComponent', () => {
  let component: GradeDetailComponent;
  let fixture: ComponentFixture<GradeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GradeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
