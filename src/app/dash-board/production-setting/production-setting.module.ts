import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ProductionSettingRoutingModule } from './production-setting-routing.module';
import { FixtureMachineMasterComponent } from './fixture-machine-master/fixture-machine-master.component';
import { ProductionSettingComponent } from './production-setting.component';
import { AgGridModule } from 'ag-grid-angular';
import { AgrenderercomponentModule } from 'src/app/shared/services/agrenderercomponent/agrenderercomponent.module';
import { BreadcrumbModule } from '../breadcrumb/breadcrumb.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MachineSettingManager } from 'src/app/shared/services/restcontroller/bizservice/machine-setting.service';
import { DepartmentsManager } from 'src/app/shared/services/restcontroller/bizservice/Departments.service';
import { ChecklistSettingManager } from 'src/app/shared/services/restcontroller/bizservice/checklist-setting.service';
import { PreventiveactionSettingManager } from 'src/app/shared/services/restcontroller/bizservice/preventiveaction-setting.service';
import { RootCauseSettingManager } from 'src/app/shared/services/restcontroller/bizservice/root-cause-setting.service';
import { BreakdownSettingManager } from 'src/app/shared/services/restcontroller/bizservice/breakdown.service';
import { StatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/status-setting.service';
import { SparesettingManager } from 'src/app/shared/services/restcontroller/bizservice/sparesetting.service';
import { FixtureSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturesetting.service';
import { FixtureSpareMasterComponent } from './fixture-spare-master/fixture-spare-master.component';
import { FixtureSparesettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturespare.service';
import { FixtureChecklistComponent } from './fixture-checklist/fixture-checklist.component';
import { FixtureChecklistSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturechecklist.service';
import { FixtureBreakdownComponent } from './fixture-breakdown/fixture-breakdown.component';
import { FixtureRootcauseComponent } from './fixture-rootcause/fixture-rootcause.component';
import { FixturePreventiveActionComponent } from './fixture-preventive-action/fixture-preventive-action.component';
import { FixtureStatusComponent } from './fixture-status/fixture-status.component';
import { FixtureStatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturestatus.service';
import { FixtureBreakdownSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturebreakdown.service';
import { CalendarModule } from 'primeng/calendar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { FixtureRootCauseSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturerootcause.service';
import { FixturePreventiveactionManager } from 'src/app/shared/services/restcontroller/bizservice/fixturepreventiveaction.service';
import { ToolsMasterComponent } from './tools-master/tools-master.component';
import { ToolsSpareMasterComponent } from './tools-spare-master/tools-spare-master.component';
import { ToolsStatusComponent } from './tools-status/tools-status.component';
import { ToolsStatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/toolsstatus.service';
import { ToolsMasterSettingManager } from 'src/app/shared/services/restcontroller/bizservice/toolsmaster.service';
import { ToolsSparesettingManager } from 'src/app/shared/services/restcontroller/bizservice/toolsspare.service';
import { ToolsBreakdownComponent } from './tools-breakdown/tools-breakdown.component';
import { ToolsBreakdownSettingManager } from 'src/app/shared/services/restcontroller/bizservice/toolsbreakdown.service';
import { ToolsChecklistComponent } from './tools-checklist/tools-checklist.component';
import { ToolsChecklistSettingManager } from 'src/app/shared/services/restcontroller/bizservice/toolschecklist.service';
import { ToolsRootcauseComponent } from './tools-rootcause/tools-rootcause.component';
import { ToolsRootCauseSettingManager } from 'src/app/shared/services/restcontroller/bizservice/toolsrootcause.service';
import { ToolsPreventiveActionComponent } from './tools-preventive-action/tools-preventive-action.component';
import { ToolsPreventiveactionManager } from 'src/app/shared/services/restcontroller/bizservice/toolspreventiveaction.service';


@NgModule({
  declarations: [FixtureMachineMasterComponent,
    ProductionSettingComponent,
    FixtureSpareMasterComponent,
    FixtureChecklistComponent,
    FixtureBreakdownComponent,
    FixtureRootcauseComponent,
    FixturePreventiveActionComponent,
    FixtureStatusComponent,
    ToolsMasterComponent,
    ToolsSpareMasterComponent,
    ToolsStatusComponent,
    ToolsBreakdownComponent,
    ToolsChecklistComponent,
    ToolsRootcauseComponent,
    ToolsPreventiveActionComponent
 ],
  imports: [
    CommonModule,
    ProductionSettingRoutingModule,
    AgGridModule.withComponents([]),
    AgrenderercomponentModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,

    MatTabsModule,
    CalendarModule,

    BreadcrumbModule
  ],
  providers: [
    DatePipe,
    FixtureSettingManager,
    FixtureSparesettingManager,
    FixtureStatusSettingManager,
    DepartmentsManager,
    FixtureChecklistSettingManager,
    SparesettingManager,
    StatusSettingManager,
    BreakdownSettingManager,
    RootCauseSettingManager,
    PreventiveactionSettingManager,
    FixtureBreakdownSettingManager,
    FixtureRootCauseSettingManager,
    FixturePreventiveactionManager,
    ToolsStatusSettingManager,
    ToolsMasterSettingManager,
    ToolsSparesettingManager,
    ToolsBreakdownSettingManager,
    ToolsChecklistSettingManager,
    ToolsRootCauseSettingManager,
    ToolsPreventiveactionManager
  ]
})
export class ProductionSettingModule { }
