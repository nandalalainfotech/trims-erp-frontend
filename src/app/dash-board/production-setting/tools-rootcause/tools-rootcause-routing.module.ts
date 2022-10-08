import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToolsRootcauseComponent } from './tools-rootcause.component';

const routes: Routes = [
  {
    path:"",
  component:ToolsRootcauseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolsRootcauseRoutingModule { }
