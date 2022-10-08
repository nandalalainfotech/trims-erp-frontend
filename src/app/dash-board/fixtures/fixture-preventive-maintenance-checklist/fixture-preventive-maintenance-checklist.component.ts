import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { saveAs } from 'file-saver';
import { deserialize } from 'serializer.ts/Serializer';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { ChecklistSettingManager } from 'src/app/shared/services/restcontroller/bizservice/checklist-setting.service';
import { FixtureChecklistSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturechecklist.service';
import { FixturePreventiveChecklistManager } from 'src/app/shared/services/restcontroller/bizservice/fixturepreventivechecklist.service';
import { FixtureSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturesetting.service';
import { MachineSettingManager } from 'src/app/shared/services/restcontroller/bizservice/machine-setting.service';
import { PreventiveChecklistManager } from 'src/app/shared/services/restcontroller/bizservice/preventivechecklist.service';
import { Checklist001mb } from 'src/app/shared/services/restcontroller/entities/Checklist001mb';
import { Fixture001mb } from 'src/app/shared/services/restcontroller/entities/Fixture001mb';
import { Fixturechecklist001mb } from 'src/app/shared/services/restcontroller/entities/FixtureChecklistmb';
import { FixturePreventiveChecklist001mb } from 'src/app/shared/services/restcontroller/entities/fixturepreventivechecklist.mb';
import { Fixturepreventivechecklist001wb } from 'src/app/shared/services/restcontroller/entities/fixturepreventivechecklist001wb';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';

import { Machine001mb } from 'src/app/shared/services/restcontroller/entities/Machine001mb';
import { Preventivechecklist001wb } from 'src/app/shared/services/restcontroller/entities/preventivechecklist001wb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';

@Component({
    selector: 'app-fixture-preventive-maintenance-checklist',
    templateUrl: './fixture-preventive-maintenance-checklist.component.html',
    styleUrls: ['./fixture-preventive-maintenance-checklist.component.css']
})
export class FixturePreventiveMaintenanceChecklistComponent implements OnInit {
    frameworkComponents: any;
    public gridOptions: GridOptions | any;
    fripreventiveChecklistForm: FormGroup | any;
    submitted = false;
    slNo: any;
    mslno: any;
    cpslno: any;
    checkpointdate: Date | any;
    observation: string = "";
    insertUser: string = "";
    insertDatetime: Date | any;
    updatedUser: string | null = "";
    updatedDatetime: Date | any;
    fixture001mb?: Fixture001mb;
    fixturechecklist001mbs?: Fixturechecklist001mb[] = [];
    fixturepreventchecks: Fixturepreventivechecklist001wb[] = [];
    fixturechecklistsetting?: Fixturechecklist001mb;
    preventivechecklist001wbs: any;

    user?: Login001mb | any;
    unitslno: number | any;

    constructor(
        private http: HttpClient,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private fixturepreventiveChecklistManager: FixturePreventiveChecklistManager,
        private fixtureSettingManager: FixtureSettingManager,
        private fixturechecklistSettingManager: FixtureChecklistSettingManager,
        private calloutService: CalloutService,
        private authManager: AuthManager,
        private modalService: NgbModal,
        private datePipe: DatePipe,
    ) {
        this.frameworkComponents = {
            iconRenderer: IconRendererComponent
        }
    }

    ngOnInit(): void {

        this.user = this.authManager.getcurrentUser;
        this.fripreventiveChecklistForm = this.formBuilder.group({
            mslno: [''],
            cpslno: [''],
            checkpointdate: ['', Validators.required],
            observations: new FormArray([]),
        })

        this.route.queryParams.subscribe(params => {
            this.mslno = params.mslno;
            this.loadData();
            this.fixtureSettingManager.findOne(this.mslno).subscribe(response => {
                this.fixture001mb = deserialize<Fixture001mb>(Fixture001mb, response);
            });
        });

        this.fixturechecklistSettingManager.allfixturechecklist(this.user.unitslno).subscribe(response => {
            this.fixturechecklist001mbs = deserialize<Fixturechecklist001mb[]>(Fixturechecklist001mb, response);
            for (let i = 0; i < this.fixturechecklist001mbs.length; i++) {
                this.o.push(this.formBuilder.group({
                    id: [this.fixturechecklist001mbs[i].slNo,],
                    observation: ["", Validators.required],
                    label: [this.fixturechecklist001mbs[i].fcheckpoints],
                }));
            }
        });


        this.createDataGrid001();

    }

    loadData() {
        this.fixturepreventiveChecklistManager.findAllByFixtureId(this.mslno,this.user.unitslno).subscribe(response => {
            this.fixturepreventchecks = deserialize<Fixturepreventivechecklist001wb[]>(Fixturepreventivechecklist001wb, response);
            if (this.fixturepreventchecks.length > 0) {
                this.gridOptions?.api?.setRowData(this.fixturepreventchecks);
            } else {
                this.gridOptions?.api?.setRowData([]);
            }
        });
    }

    get f() { return this.fripreventiveChecklistForm.controls; }

    get o() { return this.f.observations as FormArray; }

    createDataGrid001(): void {

        this.gridOptions = {
            paginationPageSize: 10,
            rowSelection: 'single',
        };
        this.gridOptions.editType = 'fullRow';
        this.gridOptions.enableRangeSelection = true;
        this.gridOptions.animateRows = true;
        this.gridOptions.columnDefs = [
            {
                headerName: 'Machine Code',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setMachineCode.bind(this)
            },
            {
                headerName: 'Machine Name',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setMachineName.bind(this)
            },
            {
                headerName: 'Check Points',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setCheckPoints.bind(this)
            },
            {
                headerName: 'Check Points Date',
                field: 'checkpointdate',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true
            },
            {
                headerName: 'Observation',
                field: 'observation',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true
            },
            {
                headerName: 'Edit',
                cellRenderer: 'iconRenderer',
                width: 80,
                // flex: 1,
                suppressSizeToFit: true,
                cellStyle: { textAlign: 'center' },
                cellRendererParams: {
                    onClick: this.onEditButtonClick.bind(this),
                    label: 'Edit'
                },
            },
            {
                headerName: 'Delete',
                cellRenderer: 'iconRenderer',
                width: 85,
                // flex: 1,
                suppressSizeToFit: true,
                cellStyle: { textAlign: 'center' },
                cellRendererParams: {
                    onClick: this.onDeleteButtonClick.bind(this),
                    label: 'Delete'
                },
            },
            {
                headerName: 'Audit',
                cellRenderer: 'iconRenderer',
                width: 80,
                // flex: 1,
                suppressSizeToFit: true,
                cellStyle: { textAlign: 'center' },
                cellRendererParams: {
                    onClick: this.onAuditButtonClick.bind(this),
                    label: 'Audit'
                },
            },
        ];
    }

    setMachineCode(params: any): string {
        return params.data.mslno2 ? params.data.mslno2.mcode : null;
    }

    setMachineName(params: any): string {
        return params.data.mslno2 ? params.data.mslno2.mname : null;
    }

    setCheckPoints(params: any): string {
        return params.data.cpslno2 ? params.data.cpslno2.checkpoints : null;
    }

    onEditButtonClick(params: any) {
        this.slNo = params.data.slNo;
        this.unitslno = params.data.unitslno;
        this.insertUser = params.data.insertUser;
        this.insertDatetime = params.data.insertDatetime;
        this.fripreventiveChecklistForm.patchValue({
            'mslno': params.data.mslno,
            'cpslno': params.data.cpslno,
            'checkpointdate': new Date(params.data.checkpointdate),
        });
        for (let j = 0; j < this.f.observations.controls.length; j++) {
            if (this.f.observations.value[j].id == params.data.cpslno) {
                this.f.observations.controls[j].controls["observation"].setValue(params.data.observation);
            } else {
                this.f.observations.controls[j].controls["observation"].setValue();
                this.f.observations.controls[j].controls["observation"].disable({ emitEvent: false });
            }
        }
    }



    onDeleteButtonClick(params: any) {
        const modalRef = this.modalService.open(ConformationComponent);
        modalRef.componentInstance.details = "Preventive Maintenance Checklist";
        modalRef.result.then((data) => {
            if (data == "Yes") {
                this.fixturepreventiveChecklistManager.preventchecklistdelete(params.data.slNo).subscribe((response) => {
                    for (let i = 0; i < this.fixturepreventchecks.length; i++) {
                        if (this.fixturepreventchecks[i].slNo == params.data.slNo) {
                            this.fixturepreventchecks?.splice(i, 1);
                            break;
                        }
                    }
                    const selectedRows = params.api.getSelectedRows();
                    params.api.applyTransaction({ remove: selectedRows });
                    this.calloutService.showSuccess("Preventive Maintenance Checklist Removed Successfully");
                });
            }
        })
    }

    onAuditButtonClick(params: any) {
        const modalRef = this.modalService.open(AuditComponent);
        modalRef.componentInstance.title = "Preventive Maintenance Checklist";
        modalRef.componentInstance.details = params.data
    }

    
    private markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach((control: any) => {
            control.markAsTouched();
            control.markAllAsTouched();
            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }

    onChecklistClick(event: any, fripreventiveChecklistForm: any) {
        this.markFormGroupTouched(this.fripreventiveChecklistForm);
        this.submitted = true;
        if (this.fripreventiveChecklistForm.invalid) {
            return;
        }
        let fixturepreventivechecklist001wbs: Fixturepreventivechecklist001wb[] = [];
        if (this.fixturechecklist001mbs) {
            for (let i = 0; i < this.fixturechecklist001mbs.length; i++) {
                for (let j = 0; j < this.f.observations.controls.length; j++) {
                    if (this.fixturechecklist001mbs[i].fcheckpoints == this.f.observations.value[j].label) {
                        let fixturepreventivechecklist001wb = new Fixturepreventivechecklist001wb();
                        fixturepreventivechecklist001wb.mslno = this.fixture001mb?.slNo;
                        fixturepreventivechecklist001wb.cpslno = this.fixturechecklist001mbs[i].slNo ? this.fixturechecklist001mbs[i].slNo : 0;
                        fixturepreventivechecklist001wb.checkpointdate = this.f.checkpointdate.value ? this.f.checkpointdate.value : "dd-MM-yyyy";
                        fixturepreventivechecklist001wb.observation = this.f.observations.value[j].observation ? this.f.observations.value[j].observation : "";
                        fixturepreventivechecklist001wb.unitslno = this.user.unitslno;
                        fixturepreventivechecklist001wb.insertUser = this.authManager.getcurrentUser.username;
                        fixturepreventivechecklist001wb.insertDatetime = new Date();
                        fixturepreventivechecklist001wbs.push(fixturepreventivechecklist001wb);
                        console.log("fixturepreventivechecklist001wbs", fixturepreventivechecklist001wbs);

                    }
                }
            }
        }


        let fixturepreventivechecklist001wb = new Fixturepreventivechecklist001wb();
        if (this.slNo) {
            fixturepreventivechecklist001wb.slNo = this.slNo;
            fixturepreventivechecklist001wb.unitslno = this.unitslno;
            fixturepreventivechecklist001wb.insertUser = this.insertUser;
            fixturepreventivechecklist001wb.insertDatetime = this.insertDatetime;
            fixturepreventivechecklist001wb.updatedUser = this.authManager.getcurrentUser.username;
            fixturepreventivechecklist001wb.updatedDatetime = new Date();
            fixturepreventivechecklist001wb.mslno = this.fixture001mb?.slNo;
            fixturepreventivechecklist001wb.cpslno = this.f.cpslno.value;
            fixturepreventivechecklist001wb.checkpointdate = this.f.checkpointdate.value ? this.f.checkpointdate.value : "dd-MM-yyyy";
            for (let j = 0; j < this.f.observations.controls.length; j++) {
                if (this.f.observations.value[j].id == this.f.cpslno.value) {
                    fixturepreventivechecklist001wb.observation = this.f.observations.controls[j].controls["observation"].value;
                }
            }
            this.fixturepreventiveChecklistManager.preventchecklistupdate(fixturepreventivechecklist001wb).subscribe((response) => {
                this.calloutService.showSuccess("Preventive Maintenance Checklist Updated Successfully");
                this.loadData();
                this.fripreventiveChecklistForm.controls['checkpointdate'].reset();
                for (let j = 0; j < this.f.observations.controls.length; j++) {
                    this.f.observations.controls[j].controls["observation"].reset();
                    this.f.observations.controls[j].controls["observation"].enable();
                }
                this.slNo = null;
                this.submitted = false;
            });
        }
        else {
            fixturepreventivechecklist001wb.unitslno = this.user.unitslno;
            fixturepreventivechecklist001wb.insertUser = this.authManager.getcurrentUser.username;
            fixturepreventivechecklist001wb.insertDatetime = new Date();
            this.fixturepreventiveChecklistManager.preventchecklistsave(fixturepreventivechecklist001wbs).subscribe((response) => {
                this.calloutService.showSuccess("Preventive Maintenance Checklist Saved Successfully");
                this.loadData();
                this.fripreventiveChecklistForm.controls['checkpointdate'].reset();
                for (let j = 0; j < this.f.observations.controls.length; j++) {
                    this.f.observations.controls[j].controls["observation"].reset();
                }
                this.submitted = false;
            });
        };
    }

    onReset() {
        this.submitted = false;
        this.fripreventiveChecklistForm.controls['checkpointdate'].reset();
        for (let j = 0; j < this.f.observations.controls.length; j++) {
            this.f.observations.controls[j].controls["observation"].reset();
            this.f.observations.controls[j].controls["observation"].enable();
        }
    }

    onViewClick() {
        this.fixturepreventiveChecklistManager.preCheckPdf(this.mslno,this.user.unitslno).subscribe((response) => {
            var blob = new Blob([response], { type: 'application/pdf' });
            var blobURL = URL.createObjectURL(blob);
            window.open(blobURL);
        })
    }

    onGeneratePdfReport() {
        this.fixturepreventiveChecklistManager.preCheckPdf(this.mslno,this.user.unitslno).subscribe((response) => {
            if (this.fixture001mb) {
                saveAs(response, this.fixture001mb.fname);
            } else {
                saveAs(response, "download");
            }
        })
    }

    onGenerateExcelReport() {
        this.fixturepreventiveChecklistManager.preCheckExcel(this.mslno,this.user.unitslno).subscribe((response) => {
            if (this.fixture001mb) {
                saveAs(response, this.fixture001mb.fname);
            } else {
                saveAs(response, "download");
            }
        })
    }
}