import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { AgGridModule } from 'ag-grid-angular';
import { CalendarModule } from 'primeng/calendar';
import { OnlyLetterModule } from 'src/app/shared/modules/onlyLetter.module';
import { OnlyNumberModule } from 'src/app/shared/modules/onlynumber.module';

import { AgrenderercomponentModule } from 'src/app/shared/services/agrenderercomponent/agrenderercomponent.module';
import { CompanyDetailsManager } from 'src/app/shared/services/restcontroller/bizservice/Companydetails.service';
import { CustmerRegManager } from 'src/app/shared/services/restcontroller/bizservice/CustemerRegistration.service';
import { CustomerConsigneeManager } from 'src/app/shared/services/restcontroller/bizservice/customer-consignee.service';
import { CustomerManager } from 'src/app/shared/services/restcontroller/bizservice/customer.service';
import { SalesInvoiceManager } from 'src/app/shared/services/restcontroller/bizservice/salesinvoice.service';
import { SalesOrderManager } from 'src/app/shared/services/restcontroller/bizservice/Salesorder.service';
import { SupplierQuotationManager } from 'src/app/shared/services/restcontroller/bizservice/supplierquotation.service';
import { BreadcrumbModule } from '../breadcrumb/breadcrumb.module';
import { SalesInvoiceComponent } from './sales-invoice/sales-invoice.component';
import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';
import { SalesQuotationComponent } from './sales-quotation/sales-quotation.component';



@NgModule({
  declarations: [
   SalesInvoiceComponent,
   SalesComponent,
   SalesQuotationComponent,
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    BreadcrumbModule,
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
    DatePipe,
   SupplierQuotationManager,
   SalesOrderManager,
   CustomerManager,
   SalesInvoiceManager,
   CustmerRegManager,
   CustomerConsigneeManager
 
  ]
})
export class SalesModule { }
