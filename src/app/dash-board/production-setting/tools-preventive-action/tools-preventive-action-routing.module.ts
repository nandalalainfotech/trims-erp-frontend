import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToolsPreventiveActionComponent } from './tools-preventive-action.component';

const routes: Routes = [
  {
    path:"",
  component:ToolsPreventiveActionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolsPreventiveActionRoutingModule { }
