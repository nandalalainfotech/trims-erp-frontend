import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import * as saveAs from 'file-saver';
import { deserialize } from 'serializer.ts/Serializer';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { BreakdownSettingManager } from 'src/app/shared/services/restcontroller/bizservice/breakdown.service';
import { FixtureBreakdownSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturebreakdown.service';
import { FixtureStatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturestatus.service';
import { StatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/status-setting.service';
import { Breakdown001mb } from 'src/app/shared/services/restcontroller/entities/Breakdown001mb';
import { FixtureBreakdown001mb } from 'src/app/shared/services/restcontroller/entities/FixtureBreakdown001mb';
import { FixtureStatus001mb } from 'src/app/shared/services/restcontroller/entities/FixtureStatusmb';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { Status001mb } from 'src/app/shared/services/restcontroller/entities/status001mb';
import { BaseService } from 'src/app/shared/services/services/base.service';
import { CalloutService } from 'src/app/shared/services/services/callout.service';
@Component({
  selector: 'app-fixture-breakdown',
  templateUrl: './fixture-breakdown.component.html',
  styleUrls: ['./fixture-breakdown.component.css']
})
export class FixtureBreakdownComponent implements OnInit {

  public gridOptions: GridOptions | any;
  frameworkComponents: any;
  breakdownForm: FormGroup | any;
  submitted = false;
  slNo: number | any;
  sslno: number | any;
  fbname: string = "";
  fbdetails: string = "";
  // status: string = "";
  insertUser: string = "";
  insertDatetime: Date | any;
  updatedUser: string = "";
  updatedDatetime: Date | any;
  statussets: FixtureStatus001mb[] = [];
  breakdownSettings: FixtureBreakdown001mb[] = [];
  user?: Login001mb | any;
  unitslno: number | any;

  constructor(
    private router: Router,
    private fixturebreakdownSettingManager: FixtureBreakdownSettingManager,
    private calloutService: CalloutService,
    private authManager: AuthManager,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private baseService: BaseService,
    private fixturestatusSettingManager: FixtureStatusSettingManager,
    private httpClient: HttpClient, private http: HttpClient

  ) {

    this.frameworkComponents = {
      iconRenderer: IconRendererComponent
    }

  }

  ngOnInit(): void {
    this.user = this.authManager.getcurrentUser;

    this.createDataGrid001();

    this.breakdownForm = this.formBuilder.group({
      fbname: ['', Validators.required],
      fbdetails: ['', Validators.required],
      // status: ['', Validators.required],
      sslno: ['', Validators.required],
    })

    this.fixturestatusSettingManager.allfixturestatus(this.user.unitslno).subscribe(response => {
      this.statussets = deserialize<FixtureStatus001mb[]>(FixtureStatus001mb, response);

    });

    this.loadData();
  }



  loadData() {
    this.fixturebreakdownSettingManager.allfixturebreakdown(this.user.unitslno).subscribe(response => {
      this.breakdownSettings = deserialize<FixtureBreakdown001mb[]>(FixtureBreakdown001mb, response);
      if (this.breakdownSettings.length > 0) {
        this.gridOptions?.api?.setRowData(this.breakdownSettings);
      } else {
        this.gridOptions?.api?.setRowData([]);
      }
    });
  }

  get f() { return this.breakdownForm.controls; }

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
        headerName: 'Sl_No',
        field: 'slNo',
        width: 200,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true
      },
      {
        headerName: 'BreakDown Name',
        field: 'fbname',
        width: 200,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        // valueGetter: this.setMachineCode.bind(this)
      },
      {
        headerName: 'Details',
        field: 'fbdetails',
        width: 200,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true


      },
      {
        headerName: 'Status',
        width: 200,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: this.setStatus.bind(this)
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

  setStatus(params: any): string {
    return params.data.sslno2 ? params.data.sslno2.name : null;
  }

  onEditButtonClick(params: any) {
    this.slNo = params.data.slNo;
    this.unitslno = params.data.unitslno;
    this.insertUser = params.data.insertUser;
    this.insertDatetime = params.data.insertDatetime;
    this.breakdownForm.patchValue({
      'fbname': params.data.fbname,
      'fbdetails': params.data.fbdetails,
      'sslno': params.data.sslno,


    });
  }

  onDeleteButtonClick(params: any) {
    const modalRef = this.modalService.open(ConformationComponent);
    modalRef.componentInstance.details = "Breakdown Setting";
    modalRef.result.then((data) => {
      if (data == "Yes") {
        this.fixturebreakdownSettingManager.breakdowndelete(params.data.slNo).subscribe((response) => {
          for (let i = 0; i < this.breakdownSettings.length; i++) {
            if (this.breakdownSettings[i].slNo == params.data.slNo) {
              this.breakdownSettings?.splice(i, 1);
              break;
            }
          }
          const selectedRows = params.api.getSelectedRows();
          params.api.applyTransaction({ remove: selectedRows });
          this.gridOptions.api.deselectAll();
          this.calloutService.showSuccess("Breakdown Details Removed Successfully");
        });
      }
    })
  }

  onAuditButtonClick(params: any) {
    const modalRef = this.modalService.open(AuditComponent);
    modalRef.componentInstance.title = "Breakdown Setting";
    modalRef.componentInstance.details = params.data;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onBreakdownFormClick(event: any, breakdownForm: any) {

    this.markFormGroupTouched(this.breakdownForm);
    this.submitted = true;
    if (this.breakdownForm.invalid) {
      return;
    }
    let fixturebreakdown001mb = new FixtureBreakdown001mb();
    fixturebreakdown001mb.fbname = this.f.fbname.value ? this.f.fbname.value : "";
    fixturebreakdown001mb.fbdetails = this.f.fbdetails.value ? this.f.fbdetails.value : "";
    fixturebreakdown001mb.sslno = this.f.sslno.value ? this.f.sslno.value : "";
    if (this.slNo) {
      fixturebreakdown001mb.slNo = this.slNo;
      fixturebreakdown001mb.unitslno = this.unitslno;
      fixturebreakdown001mb.insertUser = this.insertUser;
      fixturebreakdown001mb.insertDatetime = this.insertDatetime;
      fixturebreakdown001mb.updatedUser = this.authManager.getcurrentUser.username;
      fixturebreakdown001mb.updatedDatetime = new Date();
      this.fixturebreakdownSettingManager.breakdownupdate(fixturebreakdown001mb).subscribe((response) => {
        this.calloutService.showSuccess("Breakdown Details Updated Successfully");
        this.loadData();
        this.breakdownForm.reset();
        this.slNo = null;
        this.submitted = false;
      });
    }
    else {
      fixturebreakdown001mb.unitslno= this.user.unitslno;
      fixturebreakdown001mb.insertUser = this.authManager.getcurrentUser.username;
      fixturebreakdown001mb.insertDatetime = new Date();
      this.fixturebreakdownSettingManager.fixturebreakdowntsave(fixturebreakdown001mb).subscribe((response) => {
        this.calloutService.showSuccess("Breakdown Details Saved Successfully");
        this.loadData();
        this.breakdownForm.reset();
        this.submitted = false;
      });
    }

  }

  onReset() {
    this.submitted = false;
    this.breakdownForm.reset();
  }

  onViewClick() {
    this.fixturebreakdownSettingManager.breakPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  onGeneratePdfReport() {
    this.fixturebreakdownSettingManager.breakPdf(this.user.unitslno).subscribe((response) => {
      saveAs(response, "BreakDown-Details");
    })
  }

  onGenerateExcelReport() {
    this.fixturebreakdownSettingManager.breakExcel(this.user.unitslno).subscribe((response) => {
     saveAs(response, "BreakDown-Details");
    
    });
  }

}
