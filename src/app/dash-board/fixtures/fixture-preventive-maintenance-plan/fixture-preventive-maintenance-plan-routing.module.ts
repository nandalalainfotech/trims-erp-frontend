import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FixturePreventiveMaintenancePlanComponent } from './fixture-preventive-maintenance-plan.component';

const routes: Routes = [
  {
    path: '',
    component: FixturePreventiveMaintenancePlanComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FixturePreventiveMaintenancePlanRoutingModule { }
