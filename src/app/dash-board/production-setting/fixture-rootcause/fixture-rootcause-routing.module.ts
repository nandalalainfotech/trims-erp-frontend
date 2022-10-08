import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FixtureRootcauseComponent } from './fixture-rootcause.component';

const routes: Routes = [
  {
    path:"",
  component:FixtureRootcauseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FixtureRootcauseRoutingModule { }
