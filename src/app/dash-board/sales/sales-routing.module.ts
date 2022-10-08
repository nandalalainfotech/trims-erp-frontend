import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesInvoiceComponent } from './sales-invoice/sales-invoice.component';
import { SalesQuotationComponent } from './sales-quotation/sales-quotation.component';
import { SalesComponent } from './sales.component';

const routes: Routes = [{
  path: "",
  component: SalesComponent,
  children: [
    {
      path: "app-sales-invoice",
      component: SalesInvoiceComponent,
        
    },
    {
      path: "app-sales-quotation",
      component: SalesQuotationComponent,
        
    },
  
  ]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
