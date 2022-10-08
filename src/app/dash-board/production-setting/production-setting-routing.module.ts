import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductionSettingComponent } from './production-setting.component';
import { ProductionSettingModule } from './production-setting.module';

const routes: Routes = [  {
  path: "",
  component: ProductionSettingComponent,
  children: [
      {
          path: 'app-fixture-machine-master',
          loadChildren: () => import("./fixture-machine-master/fixture-machine-master.module").then(m => m.FixtureMachineMasterModule)
      },
      {
        path: 'app-fixture-spare-master',
        loadChildren: () => import("./fixture-spare-master/fixture-spare-master.module").then(m => m.FixtureSpareMasterModule)
    },
    {
      path: 'app-fixture-checklist',
      loadChildren: () => import("./fixture-checklist/fixture-checklist.module").then(m => m.FixtureChecklistModule)
  },
  {
    path: 'app-fixture-breakdown',
    loadChildren: () => import("./fixture-breakdown/fixture-breakdown.module").then(m => m.FixtureBreakdownModule)
  },
  {
    path: 'app-fixture-rootcause',
    loadChildren: () => import("./fixture-rootcause/fixture-rootcause.module").then(m => m.FixtureRootcauseModule)
  },
  {
    path: 'app-fixture-status',
    loadChildren: () => import("./fixture-status/fixture-status.module").then(m => m.FixtureStatusModule)
  },
  {
    path: 'app-fixture-rootcause',
    loadChildren: () => import("./fixture-rootcause/fixture-rootcause.module").then(m => m.FixtureRootcauseModule)
  },
  {
    path: 'app-fixture-preventive-action',
    loadChildren: () => import("./fixture-preventive-action/fixture-preventive-action.module").then(m => m.FixturePreventiveActionModule)
  },
  {
    path: 'app-tools-master',
    loadChildren: () => import("./tools-master/tools-master.module").then(m => m.ToolsMasterModule)
},
{
  path: 'app-tools-spare-master',
  loadChildren: () => import("./tools-spare-master/tools-spare-master.module").then(m => m.ToolsSpareMasterModule)
},
{
  path: 'app-tools-breakdown',
  loadChildren: () => import("./tools-breakdown/tools-breakdown.module").then(m => m.ToolsBreakdownModule)
},
{
  path: 'app-tools-checklist',
  loadChildren: () => import("./tools-checklist/tools-checklist.module").then(m => m.ToolsChecklistModule)
},
{
  path: 'app-tools-rootcause',
  loadChildren: () => import("./tools-rootcause/tools-rootcause.module").then(m => m.ToolsRootcauseModule)
},
{
  path: 'app-tools-preventive-action',
  loadChildren: () => import("./tools-preventive-action/tools-preventive-action.module").then(m => m.ToolsPreventiveActionModule)
},
{
  path: 'app-tools-status',
  loadChildren: () => import("./tools-status/tools-status.module").then(m => m.ToolsStatusModule)
},
  ]
  
}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionSettingRoutingModule { }
