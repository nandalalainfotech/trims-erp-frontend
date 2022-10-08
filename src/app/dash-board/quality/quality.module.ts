import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { QualityRoutingModule } from './quality-routing.module';
import { QualityCheckingComponent } from './quality-checking/quality-checking.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { CalendarModule } from 'primeng/calendar';
import { AgrenderercomponentModule } from 'src/app/shared/services/agrenderercomponent/agrenderercomponent.module';
import { BreadcrumbModule } from '../breadcrumb/breadcrumb.module';
import { MaterialInwardManager } from 'src/app/shared/services/restcontroller/bizservice/Materialinward.service';


@NgModule({
  declarations: [QualityCheckingComponent],
  imports: [
    CommonModule,
    QualityRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    AgGridModule.withComponents([]),
    AgrenderercomponentModule,
    MatTabsModule,
    BreadcrumbModule,
    CalendarModule,
    NgbModule,

  
  ],
  providers: [
    DatePipe,
    MaterialInwardManager
  ]
})
export class QualityModule { }
