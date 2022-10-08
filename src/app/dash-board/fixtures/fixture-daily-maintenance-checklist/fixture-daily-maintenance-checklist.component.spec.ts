import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixtureDailyMaintenanceChecklistComponent } from './fixture-daily-maintenance-checklist.component';

describe('FixtureDailyMaintenanceChecklistComponent', () => {
  let component: FixtureDailyMaintenanceChecklistComponent;
  let fixture: ComponentFixture<FixtureDailyMaintenanceChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixtureDailyMaintenanceChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixtureDailyMaintenanceChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
