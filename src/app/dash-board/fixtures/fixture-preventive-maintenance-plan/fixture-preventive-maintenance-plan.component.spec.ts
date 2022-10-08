import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturePreventiveMaintenancePlanComponent } from './fixture-preventive-maintenance-plan.component';

describe('FixturePreventiveMaintenancePlanComponent', () => {
  let component: FixturePreventiveMaintenancePlanComponent;
  let fixture: ComponentFixture<FixturePreventiveMaintenancePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixturePreventiveMaintenancePlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturePreventiveMaintenancePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
