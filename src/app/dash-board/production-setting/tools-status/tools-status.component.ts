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
import { ToolsStatus001mb } from 'src/app/shared/services/restcontroller/entities/toolsstatus001mb';
import { ToolsStatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/toolsstatus.service';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';


@Component({
  selector: 'app-tools-status',
  templateUrl: './tools-status.component.html',
  styleUrls: ['./tools-status.component.css']
})
export class ToolsStatusComponent implements OnInit {

  frameworkComponents: any;
  public gridOptions: GridOptions | any;
  toolsStatusForm: FormGroup | any;
  slNo: number | any;
  codeGroup: number | any;
  name: string = "";
  status: string = "";
  insertUser: string = "";
  insertDatetime: Date | any;
  updatedUser: string | null = "";
  updatedDatetime: Date | any;
  submitted = false;
  statussets: ToolsStatus001mb[] = [];
  user?: Login001mb | any;
    unitslno: number | any;

  constructor(private toolsstatusSettingManager: ToolsStatusSettingManager,
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
    this.toolsStatusForm = this.formBuilder.group({
      codeGroup: ['', Validators.required],
      name: ['', Validators.required],
      status: ['', Validators.required],
    })

    this. toolsstatusSettingManager.alltoolsstatus(this.user.unitslno).subscribe(response => {
      this.statussets = deserialize<ToolsStatus001mb[]>(ToolsStatus001mb, response);
      if (this.statussets.length > 0) {
        this.gridOptions?.api?.setRowData(this.statussets);
      } else {
        this.gridOptions?.api?.setRowData([]);
      }
    });
  }

  get f() { return this.toolsStatusForm.controls; }

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
    this.toolsStatusForm.patchValue({
      'codeGroup': params.data.codeGroup,
      'name': params.data.name,
      'status': params.data.status,
    });
  }

  onAuditButtonClick(params: any) {
    const modalRef = this.modalService.open(AuditComponent);
    modalRef.componentInstance.title = "Tools Status Setting";
    modalRef.componentInstance.details = params.data
  }

  onDeleteButtonClick(params: any) {
    const modalRef = this.modalService.open(ConformationComponent);
    modalRef.componentInstance.details = "Tools Status Setting";
    modalRef.result.then((data) => {
      if (data == "Yes") {
        this. toolsstatusSettingManager.toolsstatusdelete(params.data.slNo).subscribe((response) => {
          for (let i = 0; i < this.statussets.length; i++) {
            if (this.statussets[i].slNo == params.data.slNo) {
              this.statussets?.splice(i, 1);
              break;
            }
          }
          const selectedRows = params.api.getSelectedRows();
          params.api.applyTransaction({ remove: selectedRows });
          this.calloutService.showSuccess("Tools Status Details Removed Successfully");
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
    this.markFormGroupTouched(this.toolsStatusForm);
    this.submitted = true;
    if (this.toolsStatusForm.invalid) {
      return;
    }
   console.log("StatusForm--->", fixtureStatusForm);
   
    
    let toolsStatus001mb = new ToolsStatus001mb();
    toolsStatus001mb.codeGroup = this.f.codeGroup.value ? this.f.codeGroup.value : "";
    toolsStatus001mb.name = this.f.name.value ? this.f.name.value : "";
    toolsStatus001mb.status = this.f.status.value ? this.f.status.value : "";
    if (this.slNo) {
      toolsStatus001mb.slNo = this.slNo;
      toolsStatus001mb.unitslno = this.unitslno;
      toolsStatus001mb.insertUser = this.insertUser;
      toolsStatus001mb.insertDatetime = this.insertDatetime;
      toolsStatus001mb.updatedUser = this.authManager.getcurrentUser.username;
      toolsStatus001mb.updatedDatetime = new Date();
      this. toolsstatusSettingManager.toolsstatusupdate(toolsStatus001mb).subscribe((response) => {
        this.calloutService.showSuccess("Tools Status Details Updated Successfully");
        let statusResp = deserialize<ToolsStatus001mb>(ToolsStatus001mb, response);
        for (let toolsstatus of this.statussets) {
          if (toolsstatus.slNo == statusResp.slNo) {
            toolsstatus.codeGroup = statusResp.codeGroup;
            toolsstatus.name = statusResp.name;
            toolsstatus.status = statusResp.status;
            toolsStatus001mb.unitslno = this.unitslno;
            toolsstatus.insertUser = this.insertUser;
            toolsstatus.insertDatetime = this.insertDatetime;
            toolsstatus.updatedUser = this.authManager.getcurrentUser.username;
            toolsstatus.updatedDatetime = new Date();
          }
        }
        this.gridOptions.api.setRowData(this.statussets);
        this.gridOptions.api.refreshView();
        this.gridOptions.api.deselectAll();
        this.toolsStatusForm.reset();
        this.slNo = null;
        this.submitted = false;
      });
    } else {
      toolsStatus001mb.unitslno= this.user.unitslno;
      toolsStatus001mb.insertUser = this.authManager.getcurrentUser.username;
      toolsStatus001mb.insertDatetime = new Date();
      this. toolsstatusSettingManager.toolsstatussave(toolsStatus001mb).subscribe((response) => {
        this.calloutService.showSuccess("Tools Status Details Saved Successfully");
        let statusResp = deserialize<ToolsStatus001mb>(ToolsStatus001mb, response);
        this.statussets?.push(statusResp);
        const newItems = [JSON.parse(JSON.stringify(statusResp))];
        this.gridOptions.api.applyTransaction({ add: newItems });
        this.gridOptions.api.deselectAll();
        this.toolsStatusForm.reset();
        this.submitted = false;
      });
    }
  }

  onReset() {
    this.submitted = false;
    this.toolsStatusForm.reset();
  }


  onViewClick() {
    this. toolsstatusSettingManager.toolsstatusPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  onGeneratePdfReport() {
    this. toolsstatusSettingManager.toolsstatusPdf(this.user.unitslno).subscribe((response) => {
      saveAs(response, "Fixtxure-Status-Details");
    })
  }

  onGenerateExcelReport() {
    this. toolsstatusSettingManager.toolsstatusExcel(this.user.unitslno).subscribe((response) => {
     saveAs(response, "Fixture-Status-Details");
      });
  }
}
