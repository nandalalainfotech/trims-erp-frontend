import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToolsChecklistComponent } from './tools-checklist.component';

const routes: Routes = [
  {
    path:"",
  component:ToolsChecklistComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolsChecklistRoutingModule { }
