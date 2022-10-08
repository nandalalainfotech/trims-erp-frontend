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
import { ChecklistSettingManager } from 'src/app/shared/services/restcontroller/bizservice/checklist-setting.service';
import { FixtureChecklistSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturechecklist.service';
import { FixturedailychecklistManager } from 'src/app/shared/services/restcontroller/bizservice/Fixturedailychecklist.service';
import { FixtureSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturesetting.service';
import { MachineSettingManager } from 'src/app/shared/services/restcontroller/bizservice/machine-setting.service';
import { Checklist001mb } from 'src/app/shared/services/restcontroller/entities/Checklist001mb';
import { Fixturedailychecklist001wb } from 'src/app/shared/services/restcontroller/entities/FixturDailyCheckList001wb';
import { Fixture001mb } from 'src/app/shared/services/restcontroller/entities/Fixture001mb';
import { Fixturechecklist001mb } from 'src/app/shared/services/restcontroller/entities/FixtureChecklistmb';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { Machine001mb } from 'src/app/shared/services/restcontroller/entities/Machine001mb';
import { CalloutService } from 'src/app/shared/services/services/callout.service'

@Component({
  selector: 'app-fixture-daily-maintenance-checklist',
  templateUrl: './fixture-daily-maintenance-checklist.component.html',
  styleUrls: ['./fixture-daily-maintenance-checklist.component.css']
})
export class FixtureDailyMaintenanceChecklistComponent implements OnInit {
  mslno: any;
    submitted = false;
    slNo: any;
    cpslno: number | any;
    date: Date | any;
    frameworkComponents: any;
    public gridOptions: GridOptions | any;
    insertUser: string = "";
    insertDatetime: Date | any;
    updatedUser: string | null = "";
    updatedDatetime: Date | any;
    fixture001mb?:Fixture001mb;
    machine001mb?: Machine001mb;
    checklist001mbs?: Checklist001mb[] = [];
    checklistsetting?: Checklist001mb;
    fixturedailychecklist001wbs:Fixturedailychecklist001wb[] = [];
    fixturedailychecklist001wb?:Fixturedailychecklist001wb;
    fixturechecklist001mb?:Fixturechecklist001mb;
    fixturechecklist001mbs:Fixturechecklist001mb[]=[];
    dailyForm: FormGroup | any;
    user?: Login001mb | any;
    unitslno: number | any;

    constructor(
        private httpClient: HttpClient,
        private http: HttpClient,
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        private fixturedailychecklistManager:FixturedailychecklistManager,
        private fixtureChecklistSettingManager: FixtureChecklistSettingManager,
        private formBuilder: FormBuilder,
        private calloutService: CalloutService,
        private authManager: AuthManager,
        private modalService: NgbModal,
        private fixtureSettingManager: FixtureSettingManager,
        private datepipe: DatePipe) {
        this.frameworkComponents = {
            iconRenderer: IconRendererComponent
        }
    }

    ngOnInit(): void {

        this.user = this.authManager.getcurrentUser;
        this.route.queryParams.subscribe(params => {
            this.mslno = params.mslno;
            this.loadData();
            this.fixtureSettingManager.findOne(this.mslno).subscribe(response => {
                this.fixture001mb = deserialize<Fixture001mb>(Fixture001mb, response);
            });
        });

        this.fixtureChecklistSettingManager.allfixturechecklist(this.user.unitslno).subscribe(response => {

            this.fixturechecklist001mbs = deserialize<Fixturechecklist001mb[]>(Fixturechecklist001mb, response);
        });

        this.createDataGrid001();
        this.dailyForm = this.formBuilder.group({
            mslno: [''],
            cpslno: ['', Validators.required],
            date: [this.datepipe.transform(new Date(), 'dd-MM-yyyy')]
        })
    }

    loadData() {
        this.fixturedailychecklistManager.findAllByMachineId(this.mslno,this.user.unitslno).subscribe(response => {
            this.fixturedailychecklist001wbs = deserialize<Fixturedailychecklist001wb[]>(Fixturedailychecklist001wb, response);
            if (this.fixturedailychecklist001wbs.length > 0) {
                this.gridOptions?.api?.setRowData(this.fixturedailychecklist001wbs);
            } else {
                this.gridOptions?.api?.setRowData([]);
            }
        });
    }

    get f() { return this.dailyForm.controls }

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
                flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setMachineCode.bind(this)
            },
            {
                headerName: 'Machine Name',
                width: 200,
                flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setMachineName.bind(this)
            },
            {
                headerName: 'Check Points',
                width: 200,
                flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setCheckPoints.bind(this)
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
                    return params.data.date ? this.datePipe.transform(params.data.date, 'dd-MM-yyyy') : '';
                }
            },
            {
                headerName: 'Edit',
                cellRenderer: 'iconRenderer',
                width: 80,
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
                width: 85,
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
        this.dailyForm.patchValue({
            'mslno': params.data.mslno,
            'cpslno': params.data.cpslno,
            'date': params.data.date
        });
    }

    onDeleteButtonClick(params: any) {
        const modalRef = this.modalService.open(ConformationComponent);
        modalRef.componentInstance.details = "Daily Maintenance Checklist";
        modalRef.result.then((data) => {
            if (data == "Yes") {
                this.fixturedailychecklistManager.fixturechecklistdelete(params.data.slNo).subscribe((response) => {
                    for (let i = 0; i < this.fixturedailychecklist001wbs.length; i++) {
                        if (this.fixturedailychecklist001wbs[i].slNo == params.data.slNo) {
                            this.fixturedailychecklist001wbs?.splice(i, 1);
                            break;
                        }
                    }
                    const selectedRows = params.api.getSelectedRows();
                    params.api.applyTransaction({ remove: selectedRows });
                    this.calloutService.showSuccess("Daily Maintenance Checklist Removed Successfully");
                });
            }
        })
    }

    onAuditButtonClick(params: any) {
        const modalRef = this.modalService.open(AuditComponent);
        modalRef.componentInstance.title = "Daily Maintenance Checklist";
        modalRef.componentInstance.details = params.data
    }

    

    private markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach((control: any) => {
            control.markAsTouched();
            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }

    ondailyCheckClick(event: any, dailyForm: any) {
        console.log("dailyForm",dailyForm);
        
        this.markFormGroupTouched(this.dailyForm);
        this.submitted = true;
        if (this.dailyForm.invalid) {
            return
        }
        let fixturedailychecklist001wb = new Fixturedailychecklist001wb();
        fixturedailychecklist001wb.mslno = this.machine001mb?.slNo;
        console.log(" fixturedailychecklist001wb.mslno==>", fixturedailychecklist001wb.mslno);
        
        fixturedailychecklist001wb.cpslno = this.f.cpslno.value ? this.f.cpslno.value : "";
        fixturedailychecklist001wb.date = new Date(this.f.date.value);
        if (this.slNo) {

            fixturedailychecklist001wb.slNo = this.slNo;
            fixturedailychecklist001wb.unitslno = this.unitslno;
            fixturedailychecklist001wb.insertUser = this.insertUser;
            fixturedailychecklist001wb.insertDatetime = this.insertDatetime;
            fixturedailychecklist001wb.updatedUser = this.authManager.getcurrentUser.username;
            fixturedailychecklist001wb.updatedDatetime = new Date();
            this.fixturedailychecklistManager.fixturechecklistupdate(fixturedailychecklist001wb).subscribe((response) => {
                this.calloutService.showSuccess("Daily Maintenance Checklist Updated Successfully");
                this.loadData();
                this.dailyForm.reset();
                this.dailyForm.patchValue(
                    { date: this.datepipe.transform(new Date(), 'dd-MM-yyyy') }
                );
                this.slNo = null;
                this.submitted = false;
            });
        }
        else {
            fixturedailychecklist001wb.date = new Date();
            fixturedailychecklist001wb.unitslno= this.user.unitslno;
            fixturedailychecklist001wb.insertUser = this.authManager.getcurrentUser.username;
            fixturedailychecklist001wb.insertDatetime = new Date();
            this.fixturedailychecklistManager.fixturechecklistsave(fixturedailychecklist001wb).subscribe((response) => {
                this.calloutService.showSuccess("Daily Maintenance Checklist Saved Successfully");
                this.loadData();
                this.dailyForm.reset();
                this.dailyForm.patchValue(
                    { date: this.datepipe.transform(new Date(), 'dd-MM-yyyy') }
                );
                this.submitted = false;
            });
        }
    }


    onReset() {
        this.dailyForm.controls.cpslno.reset();
        this.submitted = false;
    }

    onViewClick() {
        this.fixturedailychecklistManager.dailyCheckPdf(this.mslno,this.user.unitslno).subscribe((response) => {
            var blob = new Blob([response], { type: 'application/pdf' });
            var blobURL = URL.createObjectURL(blob);
            window.open(blobURL);
        })
    }

    onGeneratePdfReport() {
        this.fixturedailychecklistManager.dailyCheckPdf(this.mslno,this.user.unitslno).subscribe((response) => {
            if (this.machine001mb) {
                saveAs(response, this.machine001mb.mname);
            } else {
                saveAs(response, "download");
            }
        })
    }

    onGenerateExcelReport() {
        this.fixturedailychecklistManager.dailyCheckExcel(this.mslno,this.user.unitslno).subscribe((response) => {
            if (this.machine001mb) {
                saveAs(response, this.machine001mb.mname);
            } else {
                saveAs(response, "download");
            }
        })
    }

}


