import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { saveAs } from 'file-saver';
import { deserialize } from 'serializer.ts/Serializer';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { FixturePreventivePlanManager } from 'src/app/shared/services/restcontroller/bizservice/fixturepreventiveplan.service';
import { FixtureSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturesetting.service';
import { MachineSettingManager } from 'src/app/shared/services/restcontroller/bizservice/machine-setting.service';
import { PreventivePlanManager } from 'src/app/shared/services/restcontroller/bizservice/preventiveplan.service';
import { Fixture001mb } from 'src/app/shared/services/restcontroller/entities/Fixture001mb';
import { FixturePreventiveplan001wb } from 'src/app/shared/services/restcontroller/entities/fixturepreventiveplan001wb';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { Machine001mb } from 'src/app/shared/services/restcontroller/entities/Machine001mb';
import { Preventiveplan001wb } from 'src/app/shared/services/restcontroller/entities/preventiveplan001wb';

import { CalloutService } from 'src/app/shared/services/services/callout.service';

@Component({
  selector: 'app-fixture-preventive-maintenance-plan',
  templateUrl: './fixture-preventive-maintenance-plan.component.html',
  styleUrls: ['./fixture-preventive-maintenance-plan.component.css']
})
export class FixturePreventiveMaintenancePlanComponent implements OnInit {

    fixPreMaintainPlanForm: FormGroup | any;
    submitted = false;
    frameworkComponents: any;
    public gridOptions: GridOptions | any;
    filename: string = "";
    slNo: number | any;
    mslno: number | any;
    fcode:number | any;
    fname: string = "";
    status: string = "";
    date: Date | any;
    insertUser: string = "";
    insertDatetime: Date | any;
    updatedUser: string = "";
    updatedDatetime: Date | any;
    fixture001mb?: Fixture001mb;
    fixturepreventiveplans: FixturePreventiveplan001wb[] = [];
    fixturepreventiveplan001wb?: FixturePreventiveplan001wb;
    // rowData: Observable<any[]>;
    minDate = new Date();
    maxDate = new Date();

    user?: Login001mb | any;
    unitslno: number | any;
    constructor(
        private http: HttpClient,
        private datepipe: DatePipe,
        private authManager: AuthManager,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private fixtureSettingManager: FixtureSettingManager,
        private calloutService: CalloutService,
        private fixturepreventivePlanManager: FixturePreventivePlanManager,
        private modalService: NgbModal) {
        this.frameworkComponents = {
            iconRenderer: IconRendererComponent
        }
    }

    ngOnInit(): void {
        this.user = this.authManager.getcurrentUser;
        // maxDate = new Date();
        this.maxDate.setFullYear(this.maxDate.getFullYear() + 10);
        this.createDataGrid001();
        this.fixPreMaintainPlanForm = this.formBuilder.group({
            mslno: [''],
            status: ['', Validators.required],
            date: ['', Validators.required]
        })

        this.route.queryParams.subscribe(params => {
            console.log("params",params);
            
            this.mslno = params.mslno;
            this.loadData();
            this.fixtureSettingManager.findOne(this.mslno).subscribe(response => {
                this.fixture001mb = deserialize<Fixture001mb>(Fixture001mb, response);
            });
        });
    }

    loadData() {
        this.fixturepreventivePlanManager.findAllByFixtureId(this.mslno,this.user.unitslno).subscribe(response => {
            this.fixturepreventiveplans = deserialize<FixturePreventiveplan001wb[]>(FixturePreventiveplan001wb, response);
            if (this.fixturepreventiveplans.length > 0) {
                this.gridOptions?.api?.setRowData(this.fixturepreventiveplans);
            } else {
                this.gridOptions?.api?.setRowData([]);
            }
        });
    }

    get f() { return this.fixPreMaintainPlanForm.controls; }

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
                headerName: 'Fixture Code',
                width: 200,
                flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setMachineCode.bind(this)
            },
            {
                headerName: 'Fixture Name',
                width: 200,
                flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setMachineName.bind(this)
            },
            {
                headerName: 'Status',
                field: 'status',
                width: 200,
                flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true
            },
            {
                headerName: 'Date',
                // field: 'date',
                width: 200,
                flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: (params: any) => {
                    return params.data.date ? this.datepipe.transform(params.data.date, 'dd-MM-yyyy') : '';
                }
            }, {
                headerName: 'Edit',
                cellRenderer: 'iconRenderer',
                width: 100,
                flex: 1,
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
                width: 105,
                flex: 1,
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
                flex: 1,
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
        return params.data.mslno2 ? params.data.mslno2.fcode : null;
    }

    setMachineName(params: any): string {
        return params.data.mslno2 ? params.data.mslno2.fname : null;
    }

    onAuditButtonClick(params: any) {
        const modalRef = this.modalService.open(AuditComponent);
        modalRef.componentInstance.title = "Fixture Preventive Maintenance Plan";
        modalRef.componentInstance.details = params.data
    }

    

    onEditButtonClick(params: any) {
        this.slNo = params.data.slNo;
        this.unitslno = params.data.unitslno;
        this.insertUser = params.data.insertUser;
        this.insertDatetime = params.data.insertDatetime;
        this.fixPreMaintainPlanForm.patchValue({
            'mslno': params.data.mslno,
            'status': params.data.status,
            'date': new Date(params.data.date),
        });
    }

    onDeleteButtonClick(params: any) {
        const modalRef = this.modalService.open(ConformationComponent);
        modalRef.componentInstance.details = "Fixture Preventive Maintenance Plan";
        modalRef.result.then((data) => {
            if (data == "Yes") {
                this.fixturepreventivePlanManager.preplanDelete(params.data.slNo).subscribe((response) => {
                    for (let i = 0; i < this.fixturepreventiveplans.length; i++) {
                        if (this.fixturepreventiveplans[i].slNo == params.data.slNo) {
                            this.fixturepreventiveplans?.splice(i, 1);
                            break;
                        }
                    }
                    const selectedRows = params.api.getSelectedRows();
                    params.api.applyTransaction({ remove: selectedRows });
                    this.gridOptions.api.deselectAll();
                    this.calloutService.showSuccess("Fixture Preventive Maintenance Plan Removed Successfully");
                });
            }
        });
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach((control: any) => {
            control.markAsTouched();
            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }

    onPremainPlanClick(event: any, fixPreMaintainPlanForm: any) {
        this.markFormGroupTouched(this.fixPreMaintainPlanForm);
        this.submitted = true;
        if (this.fixPreMaintainPlanForm.invalid) {
            return;
        }

        let fixturepreventiveplan001wb = new FixturePreventiveplan001wb();
        fixturepreventiveplan001wb.mslno = this.fixture001mb?.slNo;
        fixturepreventiveplan001wb.status = this.f.status.value ? this.f.status.value : "";
        fixturepreventiveplan001wb.date = new Date(this.f.date.value);
        if (this.slNo) {
            fixturepreventiveplan001wb.slNo = this.slNo;
            fixturepreventiveplan001wb.unitslno = this.unitslno;
            fixturepreventiveplan001wb.insertUser = this.insertUser;
            fixturepreventiveplan001wb.insertDatetime = this.insertDatetime;
            fixturepreventiveplan001wb.updatedUser = this.authManager.getcurrentUser.username;
            fixturepreventiveplan001wb.updatedDatetime = new Date();
            this.fixturepreventivePlanManager.fixturepreplanUpdate(fixturepreventiveplan001wb).subscribe((response) => {
                this.calloutService.showSuccess("Fixture Preventive Maintenance Plan Updated Successfully");
                this.loadData();
                this.fixPreMaintainPlanForm.reset();
                this.slNo = null;
                this.submitted = false;
            });
        } else {
            fixturepreventiveplan001wb.unitslno= this.user.unitslno;
            fixturepreventiveplan001wb.insertUser = this.authManager.getcurrentUser.username;
            fixturepreventiveplan001wb.insertDatetime = new Date();
            this.fixturepreventivePlanManager.fixturepreplansave(fixturepreventiveplan001wb).subscribe((response) => {

                this.calloutService.showSuccess("Preventive Maintenance Plan Saved Successfully");
                this.loadData();
                this.fixPreMaintainPlanForm.reset();
                this.submitted = false;
            });
        }


    }

    onReset() {
        this.submitted = false;
        this.fixPreMaintainPlanForm.reset();
    }

    onViewClick() {
        this.fixturepreventivePlanManager.prePlanPdf(this.mslno,this.user.unitslno).subscribe((response) => {
            var blob = new Blob([response], { type: 'application/pdf' });
            var blobURL = URL.createObjectURL(blob);
            window.open(blobURL);
        })
    }

    onGeneratePdfReport() {
        this.fixturepreventivePlanManager.prePlanPdf(this.mslno,this.user.unitslno).subscribe((response) => {
            if (this.fixture001mb) {
                saveAs(response, this.fixture001mb.fname);
            } else {
                saveAs(response, "download");
            }
        })
    }

    onGenerateExcelReport() {
        this.fixturepreventivePlanManager.prePlanExcel(this.mslno,this.user.unitslno).subscribe((response) => {
            if (this.fixture001mb) {
                saveAs(response, this.fixture001mb.fname);
            } else {
                saveAs(response, "download");
            }
        })
    }
}
