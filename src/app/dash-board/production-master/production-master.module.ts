import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ProductionMasterRoutingModule } from './production-master-routing.module';
import { ProductionDetailsComponent } from './production-details/production-details.component';
import { BreadcrumbModule } from '../breadcrumb/breadcrumb.module';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { AgGridModule } from 'ag-grid-angular';
import { AgrenderercomponentModule } from 'src/app/shared/services/agrenderercomponent/agrenderercomponent.module';
import { ProdManager } from 'src/app/shared/services/restcontroller/bizservice/prod.service';
import { ToolManager } from 'src/app/shared/services/restcontroller/bizservice/tool.service';
import { ProductionMasterComponent } from './production-master.component';
import { ToolsMasterComponent } from './tools-master/tools-master.component';
import { ChildPartComponent } from './child-part/child-part.component';
import { PartMasterComponent } from './part-master/part-master.component';
import { PartspecificationManager } from 'src/app/shared/services/restcontroller/bizservice/partspecification.service';
import { ChildPartManager } from 'src/app/shared/services/restcontroller/bizservice/ChildPart.service';
import { PartManager } from 'src/app/shared/services/restcontroller/bizservice/part.service';
import { ConsumerMasterComponent } from './consumer-master/consumer-master.component';
import { ConsumbleManager } from 'src/app/shared/services/restcontroller/bizservice/consumble.service';
import { SupplierTypeComponent } from './supplier-type/supplier-type.component';
import { OnlyLetterModule } from 'src/app/shared/modules/onlyLetter.module';
import { OnlyNumberModule } from 'src/app/shared/modules/onlynumber.module';




@NgModule({
  declarations: [ProductionMasterComponent,
    ProductionDetailsComponent,
    ToolsMasterComponent,
    ChildPartComponent,
    PartMasterComponent,
    ConsumerMasterComponent,
    SupplierTypeComponent
  ],
  imports: [
    CommonModule,
    ProductionMasterRoutingModule,
    BreadcrumbModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    AgGridModule.withComponents([]),
    AgrenderercomponentModule,
    OnlyNumberModule,
		OnlyLetterModule
  ],
  providers: [
    DatePipe,
    ProdManager,
    ToolManager,
    PartspecificationManager,
    ChildPartManager,
    PartManager,
    ConsumbleManager
  ]
})
export class ProductionMasterModule { }
