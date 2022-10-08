import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FixtureStatusComponent } from './fixture-status.component';

const routes: Routes = [
  {
    path:"",
  component:FixtureStatusComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FixtureStatusRoutingModule { }
