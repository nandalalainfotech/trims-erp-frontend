import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FixtureChecklistComponent } from './fixture-checklist.component';

const routes: Routes = [
  {
    path:"",
  component:FixtureChecklistComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FixtureChecklistRoutingModule { }
