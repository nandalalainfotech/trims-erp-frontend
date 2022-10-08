import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FixturePreventiveActionComponent } from './fixture-preventive-action.component';

const routes: Routes = [
  {
    path:"",
  component:FixturePreventiveActionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FixturePreventiveActionRoutingModule { }
