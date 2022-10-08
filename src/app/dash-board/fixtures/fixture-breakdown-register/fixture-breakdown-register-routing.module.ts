import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FixtureBreakdownRegisterComponent } from './fixture-breakdown-register.component';

const routes: Routes = [
  {
    path: '',
    component: FixtureBreakdownRegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FixtureBreakdownRegisterRoutingModule { }
