import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FixturePreventiveMaintenanceChecklistComponent } from '../fixture-preventive-maintenance-checklist/fixture-preventive-maintenance-checklist.component';
import { FixtureDailyMaintenanceChecklistComponent } from './fixture-daily-maintenance-checklist.component';

const routes: Routes = [
  {
    path: '',
    component: FixtureDailyMaintenanceChecklistComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FixtureDailyMaintenanceChecklistRoutingModule { }
