import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationGroupDetailComponent } from './stationgroup-detail.component';

describe('StationgroupDetailComponent', () => {
  let component: StationGroupDetailComponent;
  let fixture: ComponentFixture<StationGroupDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationGroupDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationGroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
