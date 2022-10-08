import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { deserialize } from 'serializer.ts/Serializer';
import * as saveAs from 'file-saver';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { BreakdownSettingManager } from 'src/app/shared/services/restcontroller/bizservice/breakdown.service';
import { RootCauseSettingManager } from 'src/app/shared/services/restcontroller/bizservice/root-cause-setting.service';
import { StatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/status-setting.service';
import { Breakdown001mb } from 'src/app/shared/services/restcontroller/entities/Breakdown001mb';
import { Rootcause001mb } from 'src/app/shared/services/restcontroller/entities/Rootcause001mb';
import { Status001mb } from 'src/app/shared/services/restcontroller/entities/status001mb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';
import { FixtureBreakdown001mb } from 'src/app/shared/services/restcontroller/entities/FixtureBreakdown001mb';
import { FixtureBreakdownSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturebreakdown.service';
import { FixtureStatus001mb } from 'src/app/shared/services/restcontroller/entities/FixtureStatusmb';
import { FixtureStatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturestatus.service';
import { FixtureRootcause001mb } from 'src/app/shared/services/restcontroller/entities/fixturerootcause.mb';
import { FixtureRootCauseSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturerootcause.service';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';


@Component({
  selector: 'app-fixture-rootcause',
  templateUrl: './fixture-rootcause.component.html',
  styleUrls: ['./fixture-rootcause.component.css']
})
export class FixtureRootcauseComponent implements OnInit {

  public gridOptions: GridOptions | any;
    frameworkComponents: any;
    rootCauseSettingForm: FormGroup | any;
    submitted = false;
    slNo: number | any;
    sslno: number | any;
    fbrslno: number | any;
    fname: string = "";
    fdetails: string = "";
    insertUser: string = "";
    insertDatetime: Date | any;
    updatedUser: string = "";
    updatedDatetime: Date | any;
    rootcauses: Rootcause001mb[] = [];
    statussets: FixtureStatus001mb[] = [];
    breakdownSettings: FixtureBreakdown001mb[] = [];
    rootcase001mb?: Rootcause001mb;
    user?: Login001mb | any;
    unitslno: number | any;
    
    constructor(private formBuilder: FormBuilder,
        private fixturerootCauseSettingManager: FixtureRootCauseSettingManager,
        private fixturestatusSettingManager: FixtureStatusSettingManager,
        private modalService: NgbModal,
        private fixturebreakdownSettingManager: FixtureBreakdownSettingManager,
        private authManager: AuthManager,
        private calloutService: CalloutService,
    ) {
        this.frameworkComponents = {
            //  linkRenderer: LinkRendererComponent,
            iconRenderer: IconRendererComponent
        }
    }

    ngOnInit(): void {
        this.user = this.authManager.getcurrentUser;

        this.createDataGrid001();
        this.rootCauseSettingForm = this.formBuilder.group({
            sslno: ['', Validators.required],
            fbrslno: ['', ],
            fname: ['', Validators.required],
            fdetails: ['', Validators.required],
        })

        this.fixturestatusSettingManager.allfixturestatus(this.user.unitslno).subscribe(response => {
            this.statussets = deserialize<FixtureStatus001mb[]>(FixtureStatus001mb, response);
        });

        this.fixturebreakdownSettingManager.allfixturebreakdown(this.user.unitslno).subscribe(response => {
            this.breakdownSettings = deserialize<FixtureBreakdown001mb[]>(FixtureBreakdown001mb, response);
        });

        this.loadData();
    }

    loadData() {
        this.fixturerootCauseSettingManager.allfixturerootcause(this.user.unitslno).subscribe(response => {
            this.rootcauses = deserialize<FixtureRootcause001mb[]>(FixtureRootcause001mb, response);
            if (this.rootcauses.length > 0) {
                this.gridOptions?.api?.setRowData(this.rootcauses);
            } else {
                this.gridOptions?.api?.setRowData([]);
            }
        });
    }

    get f() { return this.rootCauseSettingForm.controls; }

    createDataGrid001(): void {
        this.gridOptions = {
            paginationPageSize: 10,
            rowSelection: 'single',
            onFirstDataRendered: this.onFirstDataRendered.bind(this),
        };
        this.gridOptions.editType = 'fullRow';
        this.gridOptions.enableRangeSelection = true;
        this.gridOptions.animateRows = true;
        this.gridOptions.columnDefs = [
            {
                headerName: 'Sl_No',
                field: 'slNo',
                width: 200,
                flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
            },
            {
                headerName: 'BreakDown Name',
                width: 200,
                flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setBreakDown.bind(this)
            },
            {
                headerName: 'RootCause Name',
                field: 'fname',
                width: 200,
                flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
            },
            {
                headerName: 'Details',
                field: 'fdetails',
                width: 200,
                flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
            },
            {
                headerName: 'Status',
                field: 'sslno',
                width: 200,
                flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setStatusName.bind(this)
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

    onFirstDataRendered(params: any) {
        params.api.sizeColumnsToFit();
    }

    setStatusName(params: any): string {
        return params.data.sslno2 ? params.data.sslno2.name : null;
    }

    setBreakDown(params: any): string {
        return params.data.fbrslno ? this.breakdownSettings.find(x => x.slNo === params.data.fbrslno)?.fbname : null;
        // return params.data.brslno2 ? params.data.brslno2.name : null;
    }

    onEditButtonClick(params: any) {
        this.slNo = params.data.slNo;
        this.unitslno = params.data.unitslno;
        this.sslno = params.data.sslno;
        this.fbrslno = params.data.fbrslno;
        this.fname = params.data.fname;
        this.fdetails = params.data.fdetails;
        this.insertUser = params.data.insertUser;
        this.insertDatetime = params.data.insertDatetime;
        this.rootCauseSettingForm.patchValue({
            'sslno': params.data.sslno,
            'fbrslno': params.data.brslno,
            'fname': params.data.name,
            'fdetails': params.data.details,
        });
    }

    onAuditButtonClick(params: any) {
        const modalRef = this.modalService.open(AuditComponent);
        modalRef.componentInstance.title = "Root Cause Setting";
        modalRef.componentInstance.details = params.data
    }

    onDeleteButtonClick(params: any) {
        const modalRef = this.modalService.open(ConformationComponent);
        modalRef.componentInstance.details = "Root Cause Setting";
        modalRef.result.then((data) => {
            if (data == "Yes") {
                this.fixturerootCauseSettingManager.rootcausedelete(params.data.slNo).subscribe((response) => {
                    for (let i = 0; i < this.rootcauses.length; i++) {
                        if (this.rootcauses[i].slNo == params.data.slNo) {
                            this.rootcauses?.splice(i, 1);
                            break;
                        }
                    }
                    const selectedRows = params.api.getSelectedRows();
                    params.api.applyTransaction({ remove: selectedRows });
                    this.gridOptions.api.deselectAll();
                    this.calloutService.showSuccess("Root Cause Details Removed Successfully");
                });
            }
        })
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach((control: any) => {
            control.markAsTouched();
            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }

    onRootCauseClick(event: any, rootCauseSettingForm: any) {
        this.markFormGroupTouched(this.rootCauseSettingForm);
        this.submitted = true;
        if (this.rootCauseSettingForm.invalid) {
            return;
        }
        let fixturerootcause001mb = new FixtureRootcause001mb();
        fixturerootcause001mb.sslno = this.f.sslno.value ? this.f.sslno.value : "";
        fixturerootcause001mb.fbrslno = this.f.fbrslno.value ? this.f.fbrslno.value : "";
        fixturerootcause001mb.fname = this.f.fname.value ? this.f.fname.value : "";
        fixturerootcause001mb.fdetails = this.f.fdetails.value ? this.f.fdetails.value : "";
        if (this.slNo) {
          fixturerootcause001mb.slNo = this.slNo;
          fixturerootcause001mb.unitslno = this.unitslno;
          fixturerootcause001mb.insertUser = this.insertUser;
          fixturerootcause001mb.insertDatetime = this.insertDatetime;
          fixturerootcause001mb.updatedUser = this.authManager.getcurrentUser.username;
          fixturerootcause001mb.updatedDatetime = new Date();
            this.fixturerootCauseSettingManager.rootcauseupdate(fixturerootcause001mb).subscribe((response) => {
                this.calloutService.showSuccess("Fixture Root Cause Details Updated Successfully");
                this.loadData();
                this.rootCauseSettingForm.reset();
                this.slNo = null;
                this.submitted = false;
            });
        } else {
            fixturerootcause001mb.unitslno= this.user.unitslno;
          fixturerootcause001mb.insertUser = this.authManager.getcurrentUser.username;
          fixturerootcause001mb.insertDatetime = new Date();
            this.fixturerootCauseSettingManager.rootcausesave(fixturerootcause001mb).subscribe((response) => {
                this.calloutService.showSuccess("Fixture Root Cause Details Saved Successfully");
                this.loadData();
                this.rootCauseSettingForm.reset();
                this.submitted = false;
            });
        }
    }

    onReset() {
        this.submitted = false;
        this.rootCauseSettingForm.reset();
    }

    onViewClick() {
        this.fixturerootCauseSettingManager.rootcausePdf(this.user.unitslno).subscribe((response) => {
          var blob = new Blob([response], { type: 'application/pdf' });
          var blobURL = URL.createObjectURL(blob);
          window.open(blobURL);
        })
      }
    
      onGeneratePdfReport() {
        this.fixturerootCauseSettingManager.rootcausePdf(this.user.unitslno).subscribe((response) => {
          saveAs(response, "Rootcause-Details");
        })
      }
    
      onGenerateExcelReport() {
        this.fixturerootCauseSettingManager.rootcauseExcel(this.user.unitslno).subscribe((response) => {
         saveAs(response, "Rootcause-Details");
          });
      }
    
}
