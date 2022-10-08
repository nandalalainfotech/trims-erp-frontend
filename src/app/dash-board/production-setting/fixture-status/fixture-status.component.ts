import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as saveAs from 'file-saver';
import { GridOptions } from 'ag-grid-community';
import { deserialize } from 'serializer.ts/Serializer';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { StatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/status-setting.service';
import { Status001mb } from 'src/app/shared/services/restcontroller/entities/status001mb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';
import { FixtureStatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturestatus.service';
import { FixtureStatus001mb } from 'src/app/shared/services/restcontroller/entities/FixtureStatusmb';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';

@Component({
  selector: 'app-fixture-status',
  templateUrl: './fixture-status.component.html',
  styleUrls: ['./fixture-status.component.css']
})
export class FixtureStatusComponent implements OnInit {

  frameworkComponents: any;
  public gridOptions: GridOptions | any;
  fixtureStatusForm: FormGroup | any;
  slNo: number | any;
  codeGroup: number | any;
  name: string = "";
  status: string = "";
  insertUser: string = "";
  insertDatetime: Date | any;
  updatedUser: string | null = "";
  updatedDatetime: Date | any;
  submitted = false;
  statussets: Status001mb[] = [];
  user?: Login001mb | any;
  unitslno: number | any;

  constructor(private fixturestatusSettingManager: FixtureStatusSettingManager,
    private calloutService: CalloutService,
    private authManager: AuthManager,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,) {
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent
    }
  }

  ngOnInit(): void {
    this.user = this.authManager.getcurrentUser;

    this.createDataGrid001();
    this.fixtureStatusForm = this.formBuilder.group({
      codeGroup: ['', Validators.required],
      name: ['', Validators.required],
      status: ['', Validators.required],
    })

    this. fixturestatusSettingManager.allfixturestatus(this.user.unitslno).subscribe(response => {
      this.statussets = deserialize<FixtureStatus001mb[]>(FixtureStatus001mb, response);
      if (this.statussets.length > 0) {
        this.gridOptions?.api?.setRowData(this.statussets);
      } else {
        this.gridOptions?.api?.setRowData([]);
      }
    });
  }

  get f() { return this.fixtureStatusForm.controls; }

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
        headerName: 'Code Group',
        field: 'codeGroup',
        width: 200,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true
      },
      {
        headerName: 'Name',
        field: 'name',
        width: 200,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellClass: "grid-cell-centered",
        suppressSizeToFit: true
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

  onEditButtonClick(params: any) {
    this.slNo = params.data.slNo;
    this.unitslno = params.data.unitslno;
    this.insertUser = params.data.insertUser;
    this.insertDatetime = params.data.insertDatetime;
    this.fixtureStatusForm.patchValue({
      'codeGroup': params.data.codeGroup,
      'name': params.data.name,
      'status': params.data.status,
    });
  }

  onAuditButtonClick(params: any) {
    const modalRef = this.modalService.open(AuditComponent);
    modalRef.componentInstance.title = "Status Setting";
    modalRef.componentInstance.details = params.data
  }

  onDeleteButtonClick(params: any) {
    const modalRef = this.modalService.open(ConformationComponent);
    modalRef.componentInstance.details = "Status Setting";
    modalRef.result.then((data) => {
      if (data == "Yes") {
        this. fixturestatusSettingManager.statusdelete(params.data.slNo).subscribe((response) => {
          for (let i = 0; i < this.statussets.length; i++) {
            if (this.statussets[i].slNo == params.data.slNo) {
              this.statussets?.splice(i, 1);
              break;
            }
          }
          const selectedRows = params.api.getSelectedRows();
          params.api.applyTransaction({ remove: selectedRows });
          this.calloutService.showSuccess("Status Details Removed Successfully");
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

  onStatusClick(event: any, fixtureStatusForm: any) {
    this.markFormGroupTouched(this.fixtureStatusForm);
    this.submitted = true;
    if (this.fixtureStatusForm.invalid) {
      return;
    }
   console.log("StatusForm--->", fixtureStatusForm);
   
    
    let fixturestatus001mb = new FixtureStatus001mb();
    fixturestatus001mb.codeGroup = this.f.codeGroup.value ? this.f.codeGroup.value : "";
    fixturestatus001mb.name = this.f.name.value ? this.f.name.value : "";
    fixturestatus001mb.status = this.f.status.value ? this.f.status.value : "";
    if (this.slNo) {
      fixturestatus001mb.slNo = this.slNo;
      fixturestatus001mb.unitslno = this.unitslno;
      fixturestatus001mb.insertUser = this.insertUser;
      fixturestatus001mb.insertDatetime = this.insertDatetime;
      fixturestatus001mb.updatedUser = this.authManager.getcurrentUser.username;
      fixturestatus001mb.updatedDatetime = new Date();
      this. fixturestatusSettingManager.statusupdate(fixturestatus001mb).subscribe((response) => {
        this.calloutService.showSuccess("FixtureStatus Details Updated Successfully");
        let statusResp = deserialize<FixtureStatus001mb>(FixtureStatus001mb, response);
        for (let fixturestatus of this.statussets) {
          if (fixturestatus.slNo == statusResp.slNo) {
            fixturestatus.codeGroup = statusResp.codeGroup;
            fixturestatus.name = statusResp.name;
            fixturestatus.status = statusResp.status;
            fixturestatus001mb.unitslno = this.unitslno;
            fixturestatus.insertUser = this.insertUser;
            fixturestatus.insertDatetime = this.insertDatetime;
            fixturestatus.updatedUser = this.authManager.getcurrentUser.username;
            fixturestatus.updatedDatetime = new Date();
          }
        }
        this.gridOptions.api.setRowData(this.statussets);
        this.gridOptions.api.refreshView();
        this.gridOptions.api.deselectAll();
        this.fixtureStatusForm.reset();
        this.slNo = null;
        this.submitted = false;
      });
    } else {
      fixturestatus001mb.unitslno= this.user.unitslno;
      fixturestatus001mb.insertUser = this.authManager.getcurrentUser.username;
      fixturestatus001mb.insertDatetime = new Date();
      this. fixturestatusSettingManager.fixturestatussave(fixturestatus001mb).subscribe((response) => {
        this.calloutService.showSuccess("FixtureStatus Details Saved Successfully");
        let statusResp = deserialize<FixtureStatus001mb>(FixtureStatus001mb, response);
        this.statussets?.push(statusResp);
        const newItems = [JSON.parse(JSON.stringify(statusResp))];
        this.gridOptions.api.applyTransaction({ add: newItems });
        this.gridOptions.api.deselectAll();
        this.fixtureStatusForm.reset();
        this.submitted = false;
      });
    }
  }

  onReset() {
    this.submitted = false;
    this.fixtureStatusForm.reset();
  }


  onViewClick() {
    this. fixturestatusSettingManager.fixturestatusPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  onGeneratePdfReport() {
    this. fixturestatusSettingManager.fixturestatusPdf(this.user.unitslno).subscribe((response) => {
      saveAs(response, "Fixtxure-Status-Details");
    })
  }

  onGenerateExcelReport() {
    this. fixturestatusSettingManager.fixturestatusExcel(this.user.unitslno).subscribe((response) => {
     saveAs(response, "Fixture-Status-Details");
      });
  }
}
