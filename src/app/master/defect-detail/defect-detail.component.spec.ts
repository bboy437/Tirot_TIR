import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectDetailComponent } from './defect-detail.component';

describe('DefectDetailComponent', () => {
  let component: DefectDetailComponent;
  let fixture: ComponentFixture<DefectDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefectDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
