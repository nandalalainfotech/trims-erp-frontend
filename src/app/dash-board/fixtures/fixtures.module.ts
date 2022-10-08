
import { CommonModule, DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { AgGridModule } from 'ag-grid-angular';
import { CalendarModule } from 'primeng/calendar';
import { AgrenderercomponentModule } from 'src/app/shared/services/agrenderercomponent/agrenderercomponent.module';
import { BreakdownSettingManager } from 'src/app/shared/services/restcontroller/bizservice/breakdown.service';
import { BreakDownRegManager } from 'src/app/shared/services/restcontroller/bizservice/breakDownRegwb.service';
import { ChecklistSettingManager } from 'src/app/shared/services/restcontroller/bizservice/checklist-setting.service';
import { DailyChecklistManager } from 'src/app/shared/services/restcontroller/bizservice/Dailycecklist.service';
import { FixtureSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturesetting.service';
import { MachineReportsManager } from 'src/app/shared/services/restcontroller/bizservice/machine-reports.service';
import { MachineSettingManager } from 'src/app/shared/services/restcontroller/bizservice/machine-setting.service';
import { PreventiveactionSettingManager } from 'src/app/shared/services/restcontroller/bizservice/preventiveaction-setting.service';
import { PreventiveChecklistManager } from 'src/app/shared/services/restcontroller/bizservice/preventivechecklist.service';
import { PreventivePlanManager } from 'src/app/shared/services/restcontroller/bizservice/preventiveplan.service';
import { RootCauseSettingManager } from 'src/app/shared/services/restcontroller/bizservice/root-cause-setting.service';
import { SparesettingManager } from 'src/app/shared/services/restcontroller/bizservice/sparesetting.service';
import { BreadcrumbModule } from '../breadcrumb/breadcrumb.module';


import { FixturePreventiveMaintenancePlanComponent } from './fixture-preventive-maintenance-plan/fixture-preventive-maintenance-plan.component';
import { FixturesRoutingModule } from './fixtures-routing.module';
import { FixturesComponent } from './fixtures.component';
import { FixturePreventiveMaintenanceChecklistComponent } from './fixture-preventive-maintenance-checklist/fixture-preventive-maintenance-checklist.component';
import { FixtureDailyMaintenanceChecklistComponent } from './fixture-daily-maintenance-checklist/fixture-daily-maintenance-checklist.component';
import { FixtureBreakdownRegisterComponent } from './fixture-breakdown-register/fixture-breakdown-register.component';
import { FixtureReportComponent } from './fixture-report/fixture-report.component';
import { FixturePreventivePlanManager } from 'src/app/shared/services/restcontroller/bizservice/fixturepreventiveplan.service';
import { FixtureChecklistModule } from '../production-setting/fixture-checklist/fixture-checklist.module';
import { FixtureChecklistSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturechecklist.service';
import { FixturePreventiveChecklistManager } from 'src/app/shared/services/restcontroller/bizservice/fixturepreventivechecklist.service';


@NgModule({
  declarations: [FixturePreventiveMaintenancePlanComponent,
  FixturesComponent,
  FixturePreventiveMaintenanceChecklistComponent,
  FixtureDailyMaintenanceChecklistComponent,
  FixtureBreakdownRegisterComponent,
  FixtureReportComponent],
  imports: [
    CommonModule,
    FixturesRoutingModule,
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
    CalendarModule
  ],
  providers:[
    DatePipe,
    PreventivePlanManager,
    FixturePreventivePlanManager,
    PreventiveChecklistManager,
    DailyChecklistManager,
    ChecklistSettingManager,
    BreakdownSettingManager,
    RootCauseSettingManager,
    FixtureSettingManager,
    PreventiveactionSettingManager,
    MachineSettingManager,
    SparesettingManager,
    BreakDownRegManager,
    MachineReportsManager,
    FixturePreventiveChecklistManager,
    FixtureChecklistSettingManager
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class FixturesModule { }
