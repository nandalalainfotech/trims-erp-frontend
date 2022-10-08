import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FixtureReportComponent } from './fixture-report.component';

const routes: Routes = [
  {
    path: '',
    component: FixtureReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FixtureReportRoutingModule { }
