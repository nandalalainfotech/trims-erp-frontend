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
import { ChecklistSettingManager } from 'src/app/shared/services/restcontroller/bizservice/checklist-setting.service';
import { FixtureChecklistSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturechecklist.service';
import { FixtureSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturesetting.service';
import { FixtureStatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturestatus.service';
import { MachineSettingManager } from 'src/app/shared/services/restcontroller/bizservice/machine-setting.service';
import { StatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/status-setting.service';
import { ToolsChecklistSettingManager } from 'src/app/shared/services/restcontroller/bizservice/toolschecklist.service';
import { ToolsMasterSettingManager } from 'src/app/shared/services/restcontroller/bizservice/toolsmaster.service';
import { ToolsStatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/toolsstatus.service';
import { Checklist001mb } from 'src/app/shared/services/restcontroller/entities/Checklist001mb';
import { Fixture001mb } from 'src/app/shared/services/restcontroller/entities/Fixture001mb';
import {  Fixturechecklist001mb  } from 'src/app/shared/services/restcontroller/entities/FixtureChecklistmb';
import { FixtureStatus001mb } from 'src/app/shared/services/restcontroller/entities/FixtureStatusmb';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { Machine001mb } from 'src/app/shared/services/restcontroller/entities/Machine001mb';
import { Status001mb } from 'src/app/shared/services/restcontroller/entities/status001mb';
import { Toolschecklist001mb } from 'src/app/shared/services/restcontroller/entities/toolschecklist001mb';
import { Toolsmaster001mb } from 'src/app/shared/services/restcontroller/entities/toolsmaster001mb';
import { ToolsStatus001mb } from 'src/app/shared/services/restcontroller/entities/toolsstatus001mb';
import { BaseService } from 'src/app/shared/services/services/base.service';
import { CalloutService } from 'src/app/shared/services/services/callout.service';
import { DataSharedService } from 'src/app/shared/services/services/datashared.service';

@Component({
  selector: 'app-tools-checklist',
  templateUrl: './tools-checklist.component.html',
  styleUrls: ['./tools-checklist.component.css']
})
export class ToolsChecklistComponent implements OnInit {

  frameworkComponents: any;
  public gridOptions: GridOptions | any;
  toolschecklistForm: FormGroup | any;
  submitted = false;
  slNo: number | any;
  tstatus: number | any;
  tcslno: number | any;
  tname: string = "";
  tcheckpoints: string = "";
  insertUser: string = "";
  insertDatetime: Date | any;
  updatedUser: string = "";
  updatedDatetime: Date | any;
  //------- to declare a this name from entity file 
  fixturechecklistSettings:  Fixturechecklist001mb [] = [];
  fixturechecklist001mb?:  Fixturechecklist001mb ;
  toolsSettings: Toolsmaster001mb[] = [];
 
  statussets: FixtureStatus001mb[] = [];
  user?: Login001mb | any;
  unitslno: number | any;

  //------- to declare a constructor name from service file 
  constructor(
      private router: Router, private toolsstatusSettingManager: ToolsStatusSettingManager,
      private calloutService: CalloutService,
      private authManager: AuthManager,
      private modalService: NgbModal,
      private dataSharedService: DataSharedService,
      private authManger: AuthManager,
      private formBuilder: FormBuilder,
      private baseService: BaseService,
      private toolsMasterSettingManager: ToolsMasterSettingManager,
      private toolschecklistSettingManager: ToolsChecklistSettingManager,
      private httpClient: HttpClient, private http: HttpClient
  ) {
      this.frameworkComponents = {
          iconRenderer: IconRendererComponent
      }
  }

  ngOnInit(): void {
    this.user = this.authManager.getcurrentUser;

      this.createDataGrid001();
      this.toolschecklistForm = this.formBuilder.group({
          tcslno: ['', Validators.required],
          tname: [''],
          tcheckpoints: ['', Validators.required],
          tstatus: ['', Validators.required],
      })

      this.toolsstatusSettingManager.alltoolsstatus(this.user.unitslno).subscribe(response => {
          this.statussets = deserialize<ToolsStatus001mb[]>(ToolsStatus001mb, response);

      });
      this.toolsMasterSettingManager.findAllSlNoAndMcode(this.user.unitslno).subscribe((response: any) => {
          this.toolsSettings = deserialize<Toolsmaster001mb[]>(Toolsmaster001mb, response);
      });

      this.loadData();

      this.onChange();
  }

  loadData() {
      this.toolschecklistSettingManager.alltoolschecklist(this.user.unitslno).subscribe(response => {
          this.fixturechecklistSettings = deserialize< Toolschecklist001mb []>( Toolschecklist001mb , response);
          if (this.fixturechecklistSettings.length > 0) {
              this.gridOptions?.api?.setRowData(this.fixturechecklistSettings);
          } else {
              this.gridOptions?.api?.setRowData([]);
          }
      });
  }

  get f() { return this.toolschecklistForm.controls; }

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
              headerName: 'Tools Code',
              width: 200,
              flex: 1,
              sortable: true,
              filter: true,
              resizable: true,
              suppressSizeToFit: true,
              valueGetter: this.setFixtureCode.bind(this)
          },
          {
              headerName: 'Check Points',
              field: 'tcheckpoints',
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

  setFixtureCode(params: any): string {
      return params.data.tcslno2 ? params.data.tcslno2.tcode : null;
  }

  setStatus(params: any): string {
      return params.data.tstatus2 ? params.data.tstatus2.name : null;
  }

  onEditButtonClick(params: any) {
      this.slNo = params.data.slNo;
      this.unitslno = params.data.unitslno;
      this.insertUser = params.data.insertUser;
      this.insertDatetime = params.data.insertDatetime;
      this.toolschecklistForm.patchValue({
          'tstatus': params.data.tstatus,
          'tcslno': params.data.tcslno,
          'tcheckpoints': params.data.tcheckpoints,


      });
  }

  onDeleteButtonClick(params: any) {
      const modalRef = this.modalService.open(ConformationComponent);
      modalRef.componentInstance.details = "Checklist Setting";
      modalRef.result.then((data) => {
          if (data == "Yes") {
              this.toolschecklistSettingManager.checklistdelete(params.data.slNo).subscribe((response) => {
                  for (let i = 0; i < this.fixturechecklistSettings.length; i++) {
                      if (this.fixturechecklistSettings[i].slNo == params.data.slNo) {
                          this.fixturechecklistSettings?.splice(i, 1);
                          break;
                      }
                  }
                  const selectedRows = params.api.getSelectedRows();
                  params.api.applyTransaction({ remove: selectedRows });
                  this.gridOptions.api.deselectAll();
                  this.calloutService.showSuccess("Checklist Details Removed Successfully");
              });
          }
      })
  }

  onAuditButtonClick(params: any) {
      const modalRef = this.modalService.open(AuditComponent);
      modalRef.componentInstance.title = "Checklist Setting";
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
  // --------------------save and update method----------->
  onChecklistClick(event: any,fixturechecklistForm: any) {
      this.markFormGroupTouched(this.toolschecklistForm);
      this.submitted = true;
      if (this.toolschecklistForm.invalid) {
          return;
      }
      let toolschecklist001mb = new Toolschecklist001mb ();
      toolschecklist001mb.tcslno = this.f.tcslno.value ? this.f.tcslno.value : "";
      toolschecklist001mb.tcheckpoints = this.f.tcheckpoints.value ? this.f.tcheckpoints.value : "";
      toolschecklist001mb.tstatus = this.f.tstatus.value ? this.f.tstatus.value : "";
      if (this.slNo) {
        toolschecklist001mb.slNo = this.slNo;
        toolschecklist001mb.unitslno = this.unitslno;
        toolschecklist001mb.insertUser = this.insertUser;
        toolschecklist001mb.insertDatetime = this.insertDatetime;
        toolschecklist001mb.updatedUser = this.authManager.getcurrentUser.username;
        toolschecklist001mb.updatedDatetime = new Date();
          this.toolschecklistSettingManager.fixturechecklistupdate(toolschecklist001mb).subscribe((response) => {
              this.calloutService.showSuccess("Tools Checklist Details Updated Successfully");
              this.loadData();
              this.toolschecklistForm.reset();
              this.slNo = null;
              this.submitted = false;
          });
      }
      else {
        toolschecklist001mb.unitslno= this.user.unitslno;
        toolschecklist001mb.insertUser = this.authManager.getcurrentUser.username;
        toolschecklist001mb.insertDatetime = new Date();
          this.toolschecklistSettingManager.fixturechecklistsave(toolschecklist001mb).subscribe((response) => {
              this.calloutService.showSuccess("Tools Checklist Details Saved Successfully");
              this.loadData();
              this.toolschecklistForm.reset();
              this.submitted = false;
          });
      }
  }
  // --------------------save and update method end----------->
  onReset() {
      this.submitted = false;
      this.toolschecklistForm.reset();
  }

  onChange() {
      this.toolschecklistForm.get('tcslno').valueChanges.subscribe((value: any) => {
          for (let fixtureSetting of this.toolsSettings) {
              if (fixtureSetting.slNo == value) {
                  this.toolschecklistForm.patchValue({
                      'tname': fixtureSetting.tname
                  });
                  break;
              }
          }
      });
  }

  onViewClick() {
      this.toolschecklistSettingManager.checklistPdf(this.user.unitslno).subscribe((response) => {
        var blob = new Blob([response], { type: 'application/pdf' });
        var blobURL = URL.createObjectURL(blob);
        window.open(blobURL);
      })
    }
  
    onGeneratePdfReport() {
      this.toolschecklistSettingManager.checklistPdf(this.user.unitslno).subscribe((response) => {
        saveAs(response, "Checklist-Details");
      })
    }
  
    onGenerateExcelReport() {
      this.toolschecklistSettingManager.checklistExcel(this.user.unitslno).subscribe((response) => {
       saveAs(response, "Checklist-Details");
        });
    }
}
