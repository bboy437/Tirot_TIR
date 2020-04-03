import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysroleDetailComponent } from './sysrole-detail.component';

describe('SysroleDetailComponent', () => {
  let component: SysroleDetailComponent;
  let fixture: ComponentFixture<SysroleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysroleDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysroleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
