import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChildPartComponent } from './child-part/child-part.component';
import { ProductionDetailsComponent } from './production-details/production-details.component';
import { ProductionMasterComponent } from './production-master.component';
import { ToolsMasterComponent } from './tools-master/tools-master.component';
import { PartMasterComponent } from './part-master/part-master.component';
import { ConsumerMasterComponent } from './consumer-master/consumer-master.component';
import { SupplierTypeComponent } from './supplier-type/supplier-type.component';

const routes: Routes = [

  {
    path: "",
    component: ProductionMasterComponent,
    children: [
        {
            path: 'app-production-details',
            component: ProductionDetailsComponent,
        },
        // {
        //   path: 'app-production-details',
        //   loadChildren: () => import("./production-details/production-details.module").then(m => m.ProductionDetailsModule)
        // },
        {
          path: 'app-child-part',
          component: ChildPartComponent,
        },
        {
          path: 'app-consumer-master',
          component: ConsumerMasterComponent,
        },
        {
          path: 'app-part-master',
          component: PartMasterComponent,
        },
        {
          path: 'app-tools-master',
          component: ToolsMasterComponent,
        },
        {
          path: 'app-supplier-type',
          component: SupplierTypeComponent,
        },
       

      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionMasterRoutingModule { }
