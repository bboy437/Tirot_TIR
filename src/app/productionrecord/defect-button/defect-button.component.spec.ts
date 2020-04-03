import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectButtonComponent } from './defect-button.component';

describe('DefectButtonComponent', () => {
  let component: DefectButtonComponent;
  let fixture: ComponentFixture<DefectButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefectButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
