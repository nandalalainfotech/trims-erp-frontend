import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FixtureBreakdownComponent } from './fixture-breakdown.component';

const routes: Routes = [  {
  path:"",
component:FixtureBreakdownComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FixtureBreakdownRoutingModule { }
