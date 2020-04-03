import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineCheckListComponent } from './machine-check-list.component';

describe('MachineCheckListComponent', () => {
  let component: MachineCheckListComponent;
  let fixture: ComponentFixture<MachineCheckListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineCheckListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineCheckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
