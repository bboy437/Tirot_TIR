import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineCheckListItemComponent } from './machine-check-list-item.component';

describe('MachineCheckListItemComponent', () => {
  let component: MachineCheckListItemComponent;
  let fixture: ComponentFixture<MachineCheckListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineCheckListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineCheckListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
