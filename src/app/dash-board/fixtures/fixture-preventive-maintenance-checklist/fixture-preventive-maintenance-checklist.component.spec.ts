import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturePreventiveMaintenanceChecklistComponent } from './fixture-preventive-maintenance-checklist.component';

describe('FixturePreventiveMaintenanceChecklistComponent', () => {
  let component: FixturePreventiveMaintenanceChecklistComponent;
  let fixture: ComponentFixture<FixturePreventiveMaintenanceChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixturePreventiveMaintenanceChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturePreventiveMaintenanceChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
