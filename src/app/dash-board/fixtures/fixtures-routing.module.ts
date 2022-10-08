import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FixturesComponent } from './fixtures.component';

const routes: Routes = [
  {
    path: "",
    component: FixturesComponent,
  children: [
    {
      path: "app-fixture-preventive-maintenance-plan",
      loadChildren: () => import("./fixture-preventive-maintenance-plan/fixture-preventive-maintenance-plan.module").then(m => m.FixturePreventiveMaintenancePlanModule)

    },
    {
      path: "app-fixture-preventive-maintenance-checklist",
      loadChildren: () => import("./fixture-preventive-maintenance-checklist/fixture-preventive-maintenance-checklist.module").then(m => m.FixturePreventiveMaintenanceChecklistModule)

    },
    {
      path: "app-fixture-daily-maintenance-checklist",
      loadChildren: () => import("./fixture-daily-maintenance-checklist/fixture-daily-maintenance-checklist.module").then(m => m.FixtureDailyMaintenanceChecklistModule)
    },
    {
      path: "app-fixture-breakdown-register",
      loadChildren: () => import("./fixture-breakdown-register/fixture-breakdown-register.module").then(m => m.FixtureBreakdownRegisterModule)
    },
    {
      path: "app-fixture-report",
      loadChildren: () => import("./fixture-report/fixture-report.module").then(m => m.FixtureReportModule)
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FixturesRoutingModule { }
