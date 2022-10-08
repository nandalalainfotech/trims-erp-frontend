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
import { ToolsStatus001mb } from 'src/app/shared/services/restcontroller/entities/toolsstatus001mb';
import { ToolsStatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/toolsstatus.service';
import { ToolsBreakdown001mb } from 'src/app/shared/services/restcontroller/entities/toolsbreakdown001mb';
import { ToolsBreakdownSettingManager } from 'src/app/shared/services/restcontroller/bizservice/toolsbreakdown.service';
import { ToolsRootcause001mb } from 'src/app/shared/services/restcontroller/entities/toolsrootcause001mb';
import { ToolsRootCauseSettingManager } from 'src/app/shared/services/restcontroller/bizservice/toolsrootcause.service';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';


@Component({
  selector: 'app-tools-rootcause',
  templateUrl: './tools-rootcause.component.html',
  styleUrls: ['./tools-rootcause.component.css']
})
export class ToolsRootcauseComponent implements OnInit {

  public gridOptions: GridOptions | any;
  frameworkComponents: any;
  toolsrootCauseSettingForm: FormGroup | any;
  submitted = false;
  slNo: number | any;
  sslno: number | any;
  tbrslno: number | any;
  tname: string = "";
  tdetails: string = "";
  insertUser: string = "";
  insertDatetime: Date | any;
  updatedUser: string = "";
  updatedDatetime: Date | any;
  rootcauses: Rootcause001mb[] = [];
  statussets: ToolsStatus001mb[] = [];
  breakdownSettings: ToolsBreakdown001mb[] = [];
  rootcase001mb?: Rootcause001mb;
  user?: Login001mb | any;
    unitslno: number | any;
    
  constructor(private formBuilder: FormBuilder,
      private toolsrootCauseSettingManager: ToolsRootCauseSettingManager,
      private toolsstatusSettingManager: ToolsStatusSettingManager,
      private modalService: NgbModal,
      private toolsbreakdownSettingManager: ToolsBreakdownSettingManager,
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
      this.toolsrootCauseSettingForm = this.formBuilder.group({
          sslno: ['', Validators.required],
          tbrslno: ['', ],
          tname: ['', Validators.required],
          tdetails: ['', Validators.required],
      })

      this.toolsstatusSettingManager.alltoolsstatus(this.user.unitslno).subscribe(response => {
          this.statussets = deserialize<ToolsStatus001mb[]>(ToolsStatus001mb, response);
      });

      this.toolsbreakdownSettingManager.alltoolsbreakdown(this.user.unitslno).subscribe(response => {
          this.breakdownSettings = deserialize<ToolsBreakdown001mb[]>(ToolsBreakdown001mb, response);
      });

      this.loadData();
  }

  loadData() {
      this.toolsrootCauseSettingManager.allfixturerootcause(this.user.unitslno).subscribe(response => {
          this.rootcauses = deserialize<ToolsRootcause001mb[]>(ToolsRootcause001mb, response);
          if (this.rootcauses.length > 0) {
              this.gridOptions?.api?.setRowData(this.rootcauses);
          } else {
              this.gridOptions?.api?.setRowData([]);
          }
      });
  }

  get f() { return this.toolsrootCauseSettingForm.controls; }

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
              field: 'tname',
              width: 200,
              flex: 1,
              sortable: true,
              filter: true,
              resizable: true,
              suppressSizeToFit: true,
          },
          {
              headerName: 'Details',
              field: 'tdetails',
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
      return params.data.tbrslno ? this.breakdownSettings.find(x => x.slNo === params.data.tbrslno)?.tbname : null;
      // return params.data.brslno2 ? params.data.brslno2.name : null;
  }

  onEditButtonClick(params: any) {
      this.slNo = params.data.slNo;
      this.unitslno = params.data.unitslno;
      this.sslno = params.data.sslno;
      this.tbrslno = params.data.tbrslno;
      this.tname = params.data.tname;
      this.tdetails = params.data.tdetails;
      this.insertUser = params.data.insertUser;
      this.insertDatetime = params.data.insertDatetime;
      this.toolsrootCauseSettingForm.patchValue({
          'sslno': params.data.sslno,
          'tbrslno': params.data.tbrslno,
          'tname': params.data.tname,
          'tdetails': params.data.tdetails,
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
              this.toolsrootCauseSettingManager.rootcausedelete(params.data.slNo).subscribe((response) => {
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
      this.markFormGroupTouched(this.toolsrootCauseSettingForm);
      this.submitted = true;
      if (this.toolsrootCauseSettingForm.invalid) {
          return;
      }
      let toolsRootcause001mb = new ToolsRootcause001mb();
      toolsRootcause001mb.sslno = this.f.sslno.value ? this.f.sslno.value : "";
      toolsRootcause001mb.tbrslno = this.f.tbrslno.value ? this.f.tbrslno.value : "";
      toolsRootcause001mb.tname = this.f.tname.value ? this.f.tname.value : "";
      toolsRootcause001mb.tdetails = this.f.tdetails.value ? this.f.tdetails.value : "";
      if (this.slNo) {
        toolsRootcause001mb.slNo = this.slNo;
        toolsRootcause001mb.unitslno = this.unitslno;
        toolsRootcause001mb.insertUser = this.insertUser;
        toolsRootcause001mb.insertDatetime = this.insertDatetime;
        toolsRootcause001mb.updatedUser = this.authManager.getcurrentUser.username;
        toolsRootcause001mb.updatedDatetime = new Date();
          this.toolsrootCauseSettingManager.rootcauseupdate(toolsRootcause001mb).subscribe((response) => {
              this.calloutService.showSuccess("Tools Root Cause Details Updated Successfully");
              this.loadData();
              this.toolsrootCauseSettingForm.reset();
              this.slNo = null;
              this.submitted = false;
          });
      } else {
        toolsRootcause001mb.unitslno= this.user.unitslno;
        toolsRootcause001mb.insertUser = this.authManager.getcurrentUser.username;
        toolsRootcause001mb.insertDatetime = new Date();
          this.toolsrootCauseSettingManager.rootcausesave(toolsRootcause001mb).subscribe((response) => {
              this.calloutService.showSuccess("Tools Root Cause Details Saved Successfully");
              this.loadData();
              this.toolsrootCauseSettingForm.reset();
              this.submitted = false;
          });
      }
  }

  onReset() {
      this.submitted = false;
      this.toolsrootCauseSettingForm.reset();
  }

  onViewClick() {
      this.toolsrootCauseSettingManager.rootcausePdf(this.user.unitslno).subscribe((response) => {
        var blob = new Blob([response], { type: 'application/pdf' });
        var blobURL = URL.createObjectURL(blob);
        window.open(blobURL);
      })
    }
  
    onGeneratePdfReport() {
      this.toolsrootCauseSettingManager.rootcausePdf(this.user.unitslno).subscribe((response) => {
        saveAs(response, "Rootcause-Details");
      })
    }
  
    onGenerateExcelReport() {
      this.toolsrootCauseSettingManager.rootcauseExcel(this.user.unitslno).subscribe((response) => {
       saveAs(response, "Rootcause-Details");
        });
    }
  
}
