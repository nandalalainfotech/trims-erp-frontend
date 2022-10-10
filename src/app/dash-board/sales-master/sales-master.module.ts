import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SalesMasterRoutingModule } from './sales-master-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { AgGridModule } from 'ag-grid-angular';
import { CalendarModule } from 'primeng/calendar';
import { AgrenderercomponentModule } from 'src/app/shared/services/agrenderercomponent/agrenderercomponent.module';
import { CompanyDetailsManager } from 'src/app/shared/services/restcontroller/bizservice/Companydetails.service';
import { BreadcrumbModule } from '../breadcrumb/breadcrumb.module';
import { SalesMasterComponent } from './sales-master.component';
import { SalesDetailsComponent } from './sales-details/sales-details.component';
import { SalesMasterManager } from 'src/app/shared/services/restcontroller/bizservice/salesmaster.service';
import { CustemerRegisterComponent } from './custemer-register/custemer-register.component';
import { CustmerRegManager } from 'src/app/shared/services/restcontroller/bizservice/CustemerRegistration.service';
import { CustomerPoMasterComponent } from './customer-po-master/customer-po-master.component';
import { CustomerConsigneeMasterComponent } from './customer-consignee-master/customer-consignee-master.component';
import { CustomerConsigneeManager } from 'src/app/shared/services/restcontroller/bizservice/customer-consignee.service';
import { OnlyLetterModule } from 'src/app/shared/modules/onlyLetter.module';
import { OnlyNumberModule } from 'src/app/shared/modules/onlynumber.module';
import { CustomerPoMasterManager } from 'src/app/shared/services/restcontroller/bizservice/customerPoMaster.service';


@NgModule({
  declarations: [
  SalesMasterComponent,
  SalesDetailsComponent,
  CustemerRegisterComponent,
  CustomerPoMasterComponent,
  CustomerConsigneeMasterComponent],
  imports: [
    CommonModule,
    SalesMasterRoutingModule,
    BreadcrumbModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    AgGridModule.withComponents([]),
    AgrenderercomponentModule,
    MatTabsModule,
    CalendarModule,
    OnlyNumberModule,
		OnlyLetterModule
  ],
  providers: [
  SalesMasterManager,
  CustmerRegManager,
  CustomerConsigneeManager,
  CustomerPoMasterManager,
  DatePipe,
  ]
})
export class SalesMasterModule { }
