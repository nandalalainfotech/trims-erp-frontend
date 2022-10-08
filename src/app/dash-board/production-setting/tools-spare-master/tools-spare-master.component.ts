import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as saveAs from 'file-saver';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { deserialize } from 'serializer.ts/Serializer';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { MachineSettingManager } from 'src/app/shared/services/restcontroller/bizservice/machine-setting.service';
import { SparesettingManager } from 'src/app/shared/services/restcontroller/bizservice/sparesetting.service';
import { StatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/status-setting.service';
import { Machine001mb } from 'src/app/shared/services/restcontroller/entities/Machine001mb';
import { Spares001mb } from 'src/app/shared/services/restcontroller/entities/spares001mb';
import { Status001mb } from 'src/app/shared/services/restcontroller/entities/status001mb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';
import { Fixture001mb } from 'src/app/shared/services/restcontroller/entities/Fixture001mb';
import { FixtureSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturesetting.service';
import { FixtureSparesettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturespare.service';
import { FixtureSpares001mb } from 'src/app/shared/services/restcontroller/entities/FixtureSparemb';
import { FixtureStatus001mb } from 'src/app/shared/services/restcontroller/entities/FixtureStatusmb';
import { FixtureStatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturestatus.service';
import { ToolsStatus001mb } from 'src/app/shared/services/restcontroller/entities/toolsstatus001mb';
import { ToolsStatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/toolsstatus.service';
import { Toolsmaster001mb } from 'src/app/shared/services/restcontroller/entities/toolsmaster001mb';
import { ToolsMasterSettingManager } from 'src/app/shared/services/restcontroller/bizservice/toolsmaster.service';
import { ToolsSparesettingManager } from 'src/app/shared/services/restcontroller/bizservice/toolsspare.service';
import { ToolsSpares001mb } from 'src/app/shared/services/restcontroller/entities/toolsspare001mb';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';

@Component({
  selector: 'app-tools-spare-master',
  templateUrl: './tools-spare-master.component.html',
  styleUrls: ['./tools-spare-master.component.css']
})
export class ToolsSpareMasterComponent implements OnInit {


  public gridOptions: GridOptions | any;
  frameworkComponents: any;
  toolsspareSettingForm: FormGroup | any;
  submitted = false;
  slNo: number | any;
  msslno: number | any;
  tname: string = "";
  tspares: string = "";
  tsparescost: number | any;
  tspecification: string = "";
  tleadtime: Date | any;
  tminimumstocklevel: number | any;
  treorderlevel: number | any;
  tsslno: number | any;
  insertUser: string = "";
  insertDatetime: Date | any;
  updatedUser: string = "";
  updatedDatetime: Date | any;
  toolssparesSettings: ToolsSpares001mb[] = [];
  toolsSpares001mb?: ToolsSpares001mb;
  toolsSetting: Toolsmaster001mb[] = [];
  toolsmaster001mb?: Toolsmaster001mb;
  status001mbs?: ToolsStatus001mb[] = [];
  statussets: ToolsStatus001mb[] = [];
  user?: Login001mb | any;
  unitslno: number | any;

  constructor(
      private router: Router,
      private calloutService: CalloutService,
      private toolsSparesettingManager: ToolsSparesettingManager,
      private modalService: NgbModal,
      private formBuilder: FormBuilder,
      private authManager: AuthManager,
      private toolsstatusSettingManager: ToolsStatusSettingManager,
      private toolssettingManager: ToolsMasterSettingManager,
      private httpClient: HttpClient, private http: HttpClient,
  ) {
      this.frameworkComponents = {
          //  linkRenderer: LinkRendererComponent,
          iconRenderer: IconRendererComponent
      }

  }

  ngOnInit(): void {
    this.user = this.authManager.getcurrentUser;
      this.createDataGrid001();
      this.toolsspareSettingForm = this.formBuilder.group({
          msslno: ['', Validators.required],
          tspares: ['', Validators.required],
          tsparescost: ['', Validators.required],
          tname: [''],
          tsslno: ['', Validators.required],
          tspecification: ['', Validators.required],
          tleadtime: ['', Validators.required],
          tminimumstocklevel: ['', Validators.required],
          treorderlevel: ['', Validators.required],
      })

      this.toolsstatusSettingManager.alltoolsstatus(this.user.unitslno).subscribe(response => {
          this.statussets = deserialize<ToolsStatus001mb[]>(ToolsStatus001mb, response);
      });

      this.toolssettingManager.findAllSlNoAndMcode(this.user.unitslno).subscribe(response => {
          this.toolsSetting = deserialize<Toolsmaster001mb[]>(Toolsmaster001mb, response);
      });
      this.loadData();
      this.onChange();
  }

  loadData() {
    this.toolsSparesettingManager.alltoolssparesetting(this.user.unitslno).subscribe(response => {
      this.toolssparesSettings = deserialize<FixtureSpares001mb[]>(FixtureSpares001mb, response);
      if (this.toolssparesSettings.length > 0) {
          this.gridOptions?.api?.setRowData(this.toolssparesSettings);
      } else {
          this.gridOptions?.api?.setRowData([]);
      }

  });
  }

  get f() { return this.toolsspareSettingForm.controls; }

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
              headerName: 'Tools & Die code',
              width: 200,
              flex: 1,
              sortable: true,
              filter: true,
              resizable: true,
              suppressSizeToFit: true,
              valueGetter: this.setFixtureCode.bind(this)
          },
          {
              headerName: 'Spares',
              field: 'tspares',
              width: 200,
              flex: 1,
              sortable: true,
              filter: true,
              resizable: true,
              suppressSizeToFit: true,
          },
          {
              headerName: 'Spares Cost',
              field: 'tsparescost',
              width: 200,
              flex: 1,
              sortable: true,
              filter: true,
              resizable: true,
              suppressSizeToFit: true,
          },
          {
              headerName: 'Specification',
              field: 'tspecification',
              width: 200,
              flex: 1,
              sortable: true,
              filter: true,
              resizable: true,
              suppressSizeToFit: true,
          },
          {
              headerName: 'Lead Time',
              field: 'tleadtime',
              width: 200,
              flex: 1,
              sortable: true,
              filter: true,
              resizable: true,
              suppressSizeToFit: true,
          },
          {
              headerName: 'Minimum Stock Level',
              field: 'tminimumstocklevel',
              width: 200,
              flex: 1,
              sortable: true,
              filter: true,
              resizable: true,
              suppressSizeToFit: true,
              cellStyle: (params: { data: { minimumstocklevel: number; }; }) => {
                  if (params.data.minimumstocklevel < 5) {
                      return { color: 'red' };
                  }
                  return null;
              }
          },
          {
              headerName: 'Re-Order Level',
              field: 'treorderlevel',
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


  setStatusName(params: any): string {
      return params.data.tsslno2 ? params.data.tsslno2.name : null;
  }

  setFixtureCode(params: any): string {
      return params.data.msslno2 ? params.data.msslno2.tcode : null;
  }

  onAuditButtonClick(params: any) {
      const modalRef = this.modalService.open(AuditComponent);
      modalRef.componentInstance.title = "Spare Setting";
      modalRef.componentInstance.details = params.data
  }

  onEditButtonClick(params: any) {
      this.slNo = params.data.slNo;
      this.unitslno = params.data.unitslno;
      this.msslno = params.data.msslno;
      this.insertUser = params.data.insertUser;
      this.insertDatetime = params.data.insertDatetime;
      this.toolsspareSettingForm.patchValue({
          'tsslno': params.data.tsslno,
          'msslno': params.data.msslno,
          'tspares': params.data.tspares,
          'tsparescost': params.data.tsparescost,
          'tspecification': params.data.tspecification,
          'tleadtime': params.data.tleadtime,
          'tminimumstocklevel': params.data.tminimumstocklevel,
          'treorderlevel': params.data.treorderlevel,
      });
  }

  onDeleteButtonClick(params: any) {
      const modalRef = this.modalService.open(ConformationComponent);
      modalRef.componentInstance.details = "Tools Spare Setting";
      modalRef.result.then((data) => {
          if (data == "Yes") {
              this.toolsSparesettingManager.sparedelete(params.data.slNo).subscribe((response) => {
                  for (let i = 0; i < this.toolssparesSettings.length; i++) {
                      if (this.toolssparesSettings[i].slNo == params.data.slNo) {
                          this.toolssparesSettings?.splice(i, 1);
                          break;
                      }
                  }
                  const selectedRows = params.api.getSelectedRows();
                  params.api.applyTransaction({ remove: selectedRows });
                  this.gridOptions.api.deselectAll();
                  this.calloutService.showSuccess("Tools Spares Details Removed Successfully");
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

  onListOfSparesClick(event: any, spareSettingForm: any) {
      this.markFormGroupTouched(this.toolsspareSettingForm);
      this.submitted = true;
      if (this.toolsspareSettingForm.invalid) {
          return;
      }
      let toolsSpares001mb = new ToolsSpares001mb();
      toolsSpares001mb.tsslno = this.f.tsslno.value ? this.f.tsslno.value : "";
      toolsSpares001mb.msslno = this.f.msslno.value ? this.f.msslno.value : "";
      toolsSpares001mb.tspares = this.f.tspares.value ? this.f.tspares.value : "";
      toolsSpares001mb.tsparescost = this.f.tsparescost.value ? this.f.tsparescost.value : 0,
      toolsSpares001mb.tspecification = this.f.tspecification.value ? this.f.tspecification.value : "";
      toolsSpares001mb.tleadtime = this.f.tleadtime.value ? this.f.tleadtime.value : "";
      toolsSpares001mb.tminimumstocklevel = this.f.tminimumstocklevel.value ? this.f.tminimumstocklevel.value : "";
      toolsSpares001mb.treorderlevel = this.f.treorderlevel.value ? this.f.treorderlevel.value : "";
      if (this.slNo) {
        toolsSpares001mb.slNo = this.slNo;
        toolsSpares001mb.unitslno = this.unitslno;
        toolsSpares001mb.insertUser = this.insertUser;
        toolsSpares001mb.insertDatetime = this.insertDatetime;
        toolsSpares001mb.updatedUser = this.authManager.getcurrentUser.username;
        toolsSpares001mb.updatedDatetime = new Date();
          this.toolsSparesettingManager.fixturespareupdate(toolsSpares001mb).subscribe((response) => {
              this.calloutService.showSuccess("ToolsSpares Details Updated Successfully");
              this.loadData();
              this.toolsspareSettingForm.reset();
              this.slNo = null;
              this.submitted = false;
          });
      } else {
        toolsSpares001mb.unitslno= this.user.unitslno;
        toolsSpares001mb.insertUser = this.authManager.getcurrentUser.username;
        toolsSpares001mb.insertDatetime = new Date();
          this.toolsSparesettingManager.fixturesparesave(toolsSpares001mb).subscribe((response) => {
              this.calloutService.showSuccess("ToolsSpares Details Saved Successfully");
              this.loadData();
              this.toolsspareSettingForm.reset();
              this.submitted = false;
          });
      }
  }

  onFirstDataRendered(params: any) {
      params.api.sizeColumnsToFit();
  }

  onReset() {
      this.submitted = false;
      this.toolsspareSettingForm.reset();
  }

  onChange() {
      this.toolsspareSettingForm.get('msslno').valueChanges.subscribe((value: any) => {
          for (let fixtureSetting of this.toolsSetting) {
              if (fixtureSetting.slNo == value) {
                  this.toolsspareSettingForm.patchValue({
                      'tname': fixtureSetting.tname
                  });
                  break;
              }
          }
      });
  }

  onViewClick() {
      this.toolsSparesettingManager.sparePdf(this.user.unitslno).subscribe((response) => {
        var blob = new Blob([response], { type: 'application/pdf' });
        var blobURL = URL.createObjectURL(blob);
        window.open(blobURL);
      })
    }
  
    onGeneratePdfReport() {
      this.toolsSparesettingManager.sparePdf(this.user.unitslno).subscribe((response) => {
        saveAs(response, "Spares-Details");
      })
    }
  
    onGenerateExcelReport() {
      this.toolsSparesettingManager.spareExcel(this.user.unitslno).subscribe((response) => {
       saveAs(response, "Spares-Details");
        });
    }
  
}
