import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FixtureSpareMasterComponent } from './fixture-spare-master.component';

const routes: Routes = [
  {
    path:"",
  component:FixtureSpareMasterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FixtureSpareMasterRoutingModule { }
