import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToolsBreakdownComponent } from './tools-breakdown.component';

const routes: Routes = [
  {
    path:"",
  component:ToolsBreakdownComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolsBreakdownRoutingModule { }
