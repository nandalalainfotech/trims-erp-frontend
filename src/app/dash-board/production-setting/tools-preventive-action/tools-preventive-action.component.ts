import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import * as saveAs from 'file-saver';
import { deserialize } from 'serializer.ts/Serializer';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { FixturePreventiveactionManager } from 'src/app/shared/services/restcontroller/bizservice/fixturepreventiveaction.service';
import { FixtureRootCauseSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturerootcause.service';
import { FixtureStatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturestatus.service';
import { PreventiveactionSettingManager } from 'src/app/shared/services/restcontroller/bizservice/preventiveaction-setting.service';
import { RootCauseSettingManager } from 'src/app/shared/services/restcontroller/bizservice/root-cause-setting.service';
import { StatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/status-setting.service';
import { ToolsPreventiveactionManager } from 'src/app/shared/services/restcontroller/bizservice/toolspreventiveaction.service';
import { ToolsRootCauseSettingManager } from 'src/app/shared/services/restcontroller/bizservice/toolsrootcause.service';
import { ToolsStatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/toolsstatus.service';
import { FixturePreventiveaction001mb } from 'src/app/shared/services/restcontroller/entities/fixturepreventiveaction.mb';
import { FixtureRootcause001mb } from 'src/app/shared/services/restcontroller/entities/fixturerootcause.mb';
import { FixtureStatus001mb } from 'src/app/shared/services/restcontroller/entities/FixtureStatusmb';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { Preventiveaction001mb } from 'src/app/shared/services/restcontroller/entities/preventiveaction001mb';
import { Rootcause001mb } from 'src/app/shared/services/restcontroller/entities/Rootcause001mb';
import { Status001mb } from 'src/app/shared/services/restcontroller/entities/status001mb';
import { ToolsPreventiveaction001mb } from 'src/app/shared/services/restcontroller/entities/toolspreventiveaction001mb';
import { ToolsRootcause001mb } from 'src/app/shared/services/restcontroller/entities/toolsrootcause001mb';
import { ToolsStatus001mb } from 'src/app/shared/services/restcontroller/entities/toolsstatus001mb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';

@Component({
  selector: 'app-tools-preventive-action',
  templateUrl: './tools-preventive-action.component.html',
  styleUrls: ['./tools-preventive-action.component.css']
})
export class ToolsPreventiveActionComponent implements OnInit {

  public gridOptions: GridOptions | any;
  toolspreventiveActionForm: FormGroup | any;
  frameworkComponents: any;
  submitted = false;
  slNo: number | any;
  sslno: number | any;
  trcslno: number | any;
  tname: string = "";
  tdetails: string = "";
  insertUser: string = "";
  insertDatetime: Date | any;
  updatedUser: string | null = "";
  updatedDatetime: Date | any;
  preventiveactionSettings: ToolsPreventiveaction001mb[] = [];
  statussets: ToolsStatus001mb[] = [];
  rootcauses: ToolsRootcause001mb[] = [];
  user?: Login001mb | any;
    unitslno: number | any;


  constructor(private calloutService: CalloutService,
      private authManager: AuthManager,
      private modalService: NgbModal,
      private formBuilder: FormBuilder,
      private toolspreventiveactionManager: ToolsPreventiveactionManager,
      private toolsrootCauseSettingManager: ToolsRootCauseSettingManager,
      private toolsstatusSettingManager: ToolsStatusSettingManager,) {
      this.frameworkComponents = {
          iconRenderer: IconRendererComponent
      }
  }

  ngOnInit(): void {
    this.user = this.authManager.getcurrentUser;
      this.createDataGrid001();
      this.toolspreventiveActionForm = this.formBuilder.group({
          trcslno: ['', Validators.required],
          tname: ['', Validators.required],
          tdetails: ['', Validators.required],
          sslno: ['', Validators.required],
      })

      this.toolsstatusSettingManager.alltoolsstatus(this.user.unitslno).subscribe(response => {
          this.statussets = deserialize<ToolsStatus001mb[]>(ToolsStatus001mb, response);

      });

      this.toolsrootCauseSettingManager.allfixturerootcause(this.user.unitslno).subscribe(response => {
          this.rootcauses = deserialize<ToolsRootcause001mb[]>(ToolsRootcause001mb, response);
      });

      this.loadData();
  }

  loadData() {
      this.toolspreventiveactionManager.alltoolspreventiveaction(this.user.unitslno).subscribe(response => {
          this.preventiveactionSettings = deserialize<ToolsPreventiveaction001mb[]>(ToolsPreventiveaction001mb, response);
          if (this.preventiveactionSettings.length > 0) {
              this.gridOptions?.api?.setRowData(this.preventiveactionSettings);
          } else {
              this.gridOptions?.api?.setRowData([]);
          }
      });
  }

  get f() { return this.toolspreventiveActionForm.controls; }

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
              headerName: 'RootCause Name',
              field: 'trcslno',
              width: 200,
              flex: 1,
              sortable: true,
              filter: true,
              resizable: true,
              suppressSizeToFit: true,
              valueGetter: this.setRootCause.bind(this)
          },
          {
              headerName: 'PreventiveAction Name',
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

  setRootCause(params: any): string {
    return params.data.trcslno ? this.rootcauses.find(x => x.slNo === params.data.trcslno)?.tname : null;
      return params.data.rcslno2 ? params.data.rcslno2.name : null;
  }

  onFirstDataRendered(params: any) {
      params.api.sizeColumnsToFit();
  }

  onEditButtonClick(params: any) {
      this.slNo = params.data.slNo;
      this.unitslno = params.data.unitslno;
      this.insertUser = params.data.insertUser;
      this.insertDatetime = params.data.insertDatetime;
      this.toolspreventiveActionForm.patchValue({
          'sslno': params.data.sslno,
          'trcslno': params.data.trcslno,
          'tname': params.data.tname,
          'tdetails': params.data.tdetails,
      });
  }

  onDeleteButtonClick(params: any) {
      const modalRef = this.modalService.open(ConformationComponent);
      modalRef.componentInstance.details = "Preventive Action Setting";
      modalRef.result.then((data) => {
          if (data == "Yes") {
              this.toolspreventiveactionManager.preventiveactiondelete(params.data.slNo).subscribe((response) => {
                  for (let i = 0; i < this.preventiveactionSettings.length; i++) {
                      if (this.preventiveactionSettings[i].slNo == params.data.slNo) {
                          this.preventiveactionSettings?.splice(i, 1);
                          break;
                      }
                  }
                  const selectedRows = params.api.getSelectedRows();
                  params.api.applyTransaction({ remove: selectedRows });
                  this.gridOptions.api.deselectAll();
                  this.calloutService.showSuccess("Tools Preventive Action Details Removed Successfully");
              });
          }
      })
  }


  onAuditButtonClick(params: any) {
      const modalRef = this.modalService.open(AuditComponent);
      modalRef.componentInstance.title = "Tools Preventive Action Setting";
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

  onPreventiveClick(event: any, preventiveActionForm: any) {
      this.markFormGroupTouched(this.toolspreventiveActionForm);
      this.submitted = true;
      if (this.toolspreventiveActionForm.invalid) {
          return;
      }
      let toolsPreventiveaction001mb = new ToolsPreventiveaction001mb();
      toolsPreventiveaction001mb.trcslno = this.f.trcslno.value ? this.f.trcslno.value : "";
      toolsPreventiveaction001mb.tname = this.f.tname.value ? this.f.tname.value : "";
      toolsPreventiveaction001mb.tdetails = this.f.tdetails.value ? this.f.tdetails.value : "";
      toolsPreventiveaction001mb.sslno = this.f.sslno.value ? this.f.sslno.value : "";
      if (this.slNo) {
        toolsPreventiveaction001mb.slNo = this.slNo;
        toolsPreventiveaction001mb.unitslno = this.unitslno;
        toolsPreventiveaction001mb.insertUser = this.insertUser;
        toolsPreventiveaction001mb.insertDatetime = this.insertDatetime;
        toolsPreventiveaction001mb.updatedUser = this.authManager.getcurrentUser.username;
        toolsPreventiveaction001mb.updatedDatetime = new Date();
          this.toolspreventiveactionManager.toolspreventiveactionupdate(toolsPreventiveaction001mb).subscribe((response) => {
              this.calloutService.showSuccess("Tools Preventive Action Details Updated Successfully");
              this.loadData();
              this.toolspreventiveActionForm.reset();
              this.slNo = null;
              this.submitted = false;
          });
      }
      else {
        toolsPreventiveaction001mb.unitslno= this.user.unitslno;
        toolsPreventiveaction001mb.insertUser = this.authManager.getcurrentUser.username;
        toolsPreventiveaction001mb.insertDatetime = new Date();
          this.toolspreventiveactionManager.toolspreventiveactionsave(toolsPreventiveaction001mb).subscribe((response) => {
              this.calloutService.showSuccess("Tools Preventive Action Details Saved Successfully");
              this.loadData();
              this.toolspreventiveActionForm.reset();
              this.submitted = false;
          });
      }
  }

  onReset() {
      this.submitted = false;
      this.toolspreventiveActionForm.reset();
  }
  onViewClick() {
      this.toolspreventiveactionManager.preventPdf(this.user.unitslno).subscribe((response) => {
        var blob = new Blob([response], { type: 'application/pdf' });
        var blobURL = URL.createObjectURL(blob);
        window.open(blobURL);
      })
    }
  
    onGeneratePdfReport() {
      this.toolspreventiveactionManager.preventPdf(this.user.unitslno).subscribe((response) => {
        saveAs(response, "Preventiveaction-Details");
      })
    }
  
    onGenerateExcelReport() {
      this.toolspreventiveactionManager.preventExcel(this.user.unitslno).subscribe((response) => {
       saveAs(response, "Preventiveaction-Details");
        });
    }
  
}
