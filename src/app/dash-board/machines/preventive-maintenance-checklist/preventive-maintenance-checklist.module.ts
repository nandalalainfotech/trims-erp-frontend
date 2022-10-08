import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { OnlyLetterModule } from 'src/app/shared/modules/onlyLetter.module';
import { OnlyNumberModule } from 'src/app/shared/modules/onlynumber.module';
import { PreventiveMaintenanceChecklistRoutingModule } from './preventive-maintenance-checklist-routing.module';

@NgModule({
    declarations: [],

    imports: [
        CommonModule,
        PreventiveMaintenanceChecklistRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        AgGridModule.withComponents([]),
        OnlyNumberModule,
		OnlyLetterModule
    ],
})

export class PreventiveMaintenanceChecklistModule { }
