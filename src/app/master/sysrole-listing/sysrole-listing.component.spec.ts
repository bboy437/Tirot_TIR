import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysRoleListingComponent } from './sysrole-listing.component';

describe('SysRoleListingComponent', () => {
  let component: SysRoleListingComponent;
  let fixture: ComponentFixture<SysRoleListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysRoleListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysRoleListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
