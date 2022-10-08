import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QualityCheckingComponent } from './quality-checking/quality-checking.component';
import { QualityComponent } from './quality.component';

const routes: Routes = [
  {
    path: "",
    component: QualityComponent,
    children: [
      {
        path: "app-quality-checking",
        component: QualityCheckingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualityRoutingModule { }
