import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UomDetailComponent } from './uom-detail.component';

describe('UomDetailComponent', () => {
  let component: UomDetailComponent;
  let fixture: ComponentFixture<UomDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UomDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UomDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
