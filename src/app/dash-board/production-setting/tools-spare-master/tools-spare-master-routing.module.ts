import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToolsSpareMasterComponent } from './tools-spare-master.component';

const routes: Routes = [{
  path:"",
component:ToolsSpareMasterComponent 
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolsSpareMasterRoutingModule { }
