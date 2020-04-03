import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollDescriptionComponent } from './roll-description.component';

describe('RollDescriptionComponent', () => {
  let component: RollDescriptionComponent;
  let fixture: ComponentFixture<RollDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
