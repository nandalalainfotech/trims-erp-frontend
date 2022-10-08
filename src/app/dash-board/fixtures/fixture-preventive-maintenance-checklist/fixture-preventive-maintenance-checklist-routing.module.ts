import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FixturePreventiveMaintenanceChecklistComponent } from './fixture-preventive-maintenance-checklist.component';

const routes: Routes = [
  {
    path: '',
    component: FixturePreventiveMaintenanceChecklistComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FixturePreventiveMaintenanceChecklistRoutingModule { }
