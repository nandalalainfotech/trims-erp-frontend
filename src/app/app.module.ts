import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { AgChart } from 'ag-charts-community';
import { AgGridModule } from 'ag-grid-angular';
import { GojsAngularModule } from 'gojs-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuditComponent } from './shared/audit/audit.component';
import { ConformationComponent } from './shared/conformation/conformation.component';
import { LogoutPopupComponent } from './shared/logout-popup/logout-popup.component';
import { OrderAddItemComponent } from './shared/order-add-item/order-add-item.component';
import { SearchFilterModule } from './shared/pipe/SearchFilterModule';
import { PopupComponent } from './shared/popup/popup.component';
import { SearchFindComponent } from './shared/search-find/search-find.component';
import { SearchedPopupComponent } from './shared/searched-popup/searched-popup.component';
import { CalloutComponent } from './shared/services/callout/callout.component';
import { AuthManager } from './shared/services/restcontroller/bizservice/auth-manager.service';
import { DepartmentsManager } from './shared/services/restcontroller/bizservice/Departments.service';
import { LoginManager } from './shared/services/restcontroller/bizservice/login.service';
import { PersonManager } from './shared/services/restcontroller/bizservice/person.service';
import { RoleManager } from './shared/services/restcontroller/bizservice/role.service';
import { UserManager } from './shared/services/restcontroller/bizservice/user.service';
import { BaseService } from './shared/services/services/base.service';
import { CalloutService } from './shared/services/services/callout.service';
import { DataSharedService } from './shared/services/services/datashared.service';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { UserRegistrationModule } from './user-registration/user-registration.module';
import { JwtInterceptor } from './_helpers';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { AddPopupComponent } from './shared/add-popup/add-popup.component';
import { CustemerAddComponent } from './shared/custemer-add/custemer-add.component';
import { StatusBarComponent } from './shared/status-bar/status-bar.component';
import { StatusPopupComponent } from './shared/status-popup/status-popup.component';
import { MetriealinwardComponent } from './shared/metriealinward/metriealinward.component';
import { AddLeadsComponent } from './shared/add-leads/add-leads.component';
import { AddQuotationComponent } from './shared/add-quotation/add-quotation.component';
import { SpecificationComponent } from './shared/specification/specification.component';
import { PurchseSlipComponent } from './shared/purchse-slip/purchse-slip.component';
import { AddCustomerContactComponent } from './shared/add-customer-contact/add-customer-contact.component';
import { CustomerPoComponent } from './shared/customer-po/customer-po.component';
import { CalendarModule } from 'primeng/calendar';
import { RawMaterialComponent } from './shared/raw-material/raw-material.component';
import { PurchaseItemsComponent } from './shared/purchase-items/purchase-items.component';
import { ItemsComponent } from './shared/items/items.component';
import { OrderitemspecificationComponent } from './shared/orderitemspecification/orderitemspecification.component';
import { ConsumerSpecificationComponent } from './shared/consumer-specification/consumer-specification.component';
import { ChildpartSpecificationComponent } from './shared/childpart-specification/childpart-specification.component';
import { PartSpecificationComponent } from './shared/part-specification/part-specification.component';
import { ObservationItemsComponent } from './shared/observation-items/observation-items.component';
import { UnitManagerManager } from './shared/services/restcontroller/bizservice/unitmaster.service';
import { UnitDepartManager } from './shared/services/restcontroller/bizservice/unitdepartmaster.service';
import { PurchaseInvoicesItemsComponent } from './shared/purchase-invoices-items/purchase-invoices-items.component';
import { PurchaseInvoicePayItemManager } from './shared/services/restcontroller/bizservice/PurchaseInvoicesItems.service';
import { PurchaseInvoicePayManager } from './shared/services/restcontroller/bizservice/PurchaseInvoicePay.service';
import { PaymentPopupComponent } from './shared/payment-popup/payment-popup.component';
import { RetunStockPopupComponent } from './shared/retun-stock-popup/retun-stock-popup.component';
import { OnlyNumberModule } from './shared/modules/onlynumber.module';
import { OnlyLetterModule } from './shared/modules/onlyLetter.module';
import { StatusSettingManager } from './shared/services/restcontroller/bizservice/status-setting.service';
import { MateriealrequestItemComponent } from './shared/materiealrequest-item/materiealrequest-item.component';
import { PartItemComponent } from './shared/part-item/part-item.component';
import { CustomerPoitemManager } from './shared/services/restcontroller/bizservice/customerPoItem.service';
import { CustemerAddManager } from './shared/services/restcontroller/bizservice/Custemer-wb.service';









@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		CalloutComponent,
		PopupComponent,
		ResetPasswordComponent,
		AuditComponent,
		UserRegistrationComponent,
		ConformationComponent,
		LogoutPopupComponent,
		SearchedPopupComponent,
		SearchFindComponent,
		OrderAddItemComponent,
		AddPopupComponent,
		CustemerAddComponent,
		StatusBarComponent,
		StatusPopupComponent,
		MetriealinwardComponent,
		AddLeadsComponent,
		AddQuotationComponent,
		SpecificationComponent,
		PurchseSlipComponent,
		AddCustomerContactComponent,
		CustomerPoComponent,
		RawMaterialComponent,
		PurchaseItemsComponent,
		ItemsComponent,
		OrderitemspecificationComponent,
		ConsumerSpecificationComponent,
		ChildpartSpecificationComponent,
		PartSpecificationComponent,
		ObservationItemsComponent,
		PurchaseInvoicesItemsComponent,
		PaymentPopupComponent,
		RetunStockPopupComponent,
		MateriealrequestItemComponent,
		PartItemComponent

	
	],
	imports: [
		CommonModule,
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		NgbModule,
		AgGridModule.withComponents([]),
		NgbCollapseModule,
		UserRegistrationModule,
		GojsAngularModule,
		SearchFilterModule,
		CalendarModule,
		OnlyNumberModule,
		OnlyLetterModule
	],
	exports: [PopupComponent, NgbCollapseModule,],
	providers: [AuthManager, CalloutService, DataSharedService, LoginManager,
		 BaseService, UserManager, UnitManagerManager,UnitDepartManager,DepartmentsManager,
		  PersonManager, RoleManager,PurchaseInvoicePayItemManager,StatusSettingManager,CustomerPoitemManager,CustemerAddManager,
		  
		{ provide: LocationStrategy, useClass: PathLocationStrategy },
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },],
	bootstrap: [AppComponent],
	entryComponents: [ResetPasswordComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AppModule { }
