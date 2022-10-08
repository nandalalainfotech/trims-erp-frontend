import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToolsStatusComponent } from './tools-status.component';

const routes: Routes = [ {
  path:"",
component:ToolsStatusComponent 
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolsStatusRoutingModule { }
