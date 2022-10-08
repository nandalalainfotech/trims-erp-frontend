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
import { Checklist001mb } from 'src/app/shared/services/restcontroller/entities/Checklist001mb';
import { Fixture001mb } from 'src/app/shared/services/restcontroller/entities/Fixture001mb';
import {  Fixturechecklist001mb  } from 'src/app/shared/services/restcontroller/entities/FixtureChecklistmb';
import { FixtureStatus001mb } from 'src/app/shared/services/restcontroller/entities/FixtureStatusmb';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { Machine001mb } from 'src/app/shared/services/restcontroller/entities/Machine001mb';
import { Status001mb } from 'src/app/shared/services/restcontroller/entities/status001mb';
import { BaseService } from 'src/app/shared/services/services/base.service';
import { CalloutService } from 'src/app/shared/services/services/callout.service';
import { DataSharedService } from 'src/app/shared/services/services/datashared.service';

@Component({
  selector: 'app-fixture-checklist',
  templateUrl: './fixture-checklist.component.html',
  styleUrls: ['./fixture-checklist.component.css']
})
export class FixtureChecklistComponent implements OnInit {
  frameworkComponents: any;
  public gridOptions: GridOptions | any;
  fixturechecklistForm: FormGroup | any;
  submitted = false;
  slNo: number | any;
  fstatus: number | any;
  fcslno: number | any;
  fname: string = "";
  fcheckpoints: string = "";
  insertUser: string = "";
  insertDatetime: Date | any;
  updatedUser: string = "";
  updatedDatetime: Date | any;
  //------- to declare a this name from entity file 
  fixturechecklistSettings:  Fixturechecklist001mb [] = [];
  fixturechecklist001mb?:  Fixturechecklist001mb ;
  fixtureSettings: Fixture001mb[] = [];
  machine001mb?: Machine001mb;
  statussets: FixtureStatus001mb[] = [];

  user?: Login001mb | any;
    unitslno: number | any;

  //------- to declare a constructor name from service file 
  constructor(
      private router: Router, private fixturechecklistSettingManager: FixtureChecklistSettingManager,
      private calloutService: CalloutService,
      private authManager: AuthManager,
      private modalService: NgbModal,
      private dataSharedService: DataSharedService,
      private authManger: AuthManager,
      private formBuilder: FormBuilder,
      private baseService: BaseService,
      private fixtureSettingManager: FixtureSettingManager,
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
      this.fixturechecklistForm = this.formBuilder.group({
          fcslno: ['', Validators.required],
          fname: [''],
          fcheckpoints: ['', Validators.required],
          fstatus: ['', Validators.required],
      })

      this.fixturestatusSettingManager.allfixturestatus(this.user.unitslno).subscribe(response => {
          this.statussets = deserialize<FixtureStatus001mb[]>(FixtureStatus001mb, response);

      });
      this.fixtureSettingManager.findAllSlNoAndMcode(this.user.unitslno).subscribe((response: any) => {
          this.fixtureSettings = deserialize<Fixture001mb[]>(Fixture001mb, response);
      });

      this.loadData();

      this.onChange();
  }

  loadData() {
      this.fixturechecklistSettingManager.allfixturechecklist(this.user.unitslno).subscribe(response => {
          this.fixturechecklistSettings = deserialize< Fixturechecklist001mb []>( Fixturechecklist001mb , response);
          if (this.fixturechecklistSettings.length > 0) {
              this.gridOptions?.api?.setRowData(this.fixturechecklistSettings);
          } else {
              this.gridOptions?.api?.setRowData([]);
          }
      });
  }

  get f() { return this.fixturechecklistForm.controls; }

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
              headerName: 'Fixture Code',
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
              field: 'fcheckpoints',
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
      return params.data.fcslno2 ? params.data.fcslno2.fcode : null;
  }

  setStatus(params: any): string {
      return params.data.fstatus2 ? params.data.fstatus2.name : null;
  }

  onEditButtonClick(params: any) {
      this.slNo = params.data.slNo;
      this.unitslno = params.data.unitslno;
      this.insertUser = params.data.insertUser;
      this.insertDatetime = params.data.insertDatetime;
      this.fixturechecklistForm.patchValue({
          'fstatus': params.data.fstatus,
          'fcslno': params.data.fcslno,
          'fcheckpoints': params.data.fcheckpoints,


      });
  }

  onDeleteButtonClick(params: any) {
      const modalRef = this.modalService.open(ConformationComponent);
      modalRef.componentInstance.details = "Checklist Setting";
      modalRef.result.then((data) => {
          if (data == "Yes") {
              this.fixturechecklistSettingManager.checklistdelete(params.data.slNo).subscribe((response) => {
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
      this.markFormGroupTouched(this.fixturechecklistForm);
      this.submitted = true;
      if (this.fixturechecklistForm.invalid) {
          return;
      }
      let fixturechecklist001mb = new Fixturechecklist001mb ();
      fixturechecklist001mb.fcslno = this.f.fcslno.value ? this.f.fcslno.value : "";
      fixturechecklist001mb.fcheckpoints = this.f.fcheckpoints.value ? this.f.fcheckpoints.value : "";
      fixturechecklist001mb.fstatus = this.f.fstatus.value ? this.f.fstatus.value : "";
      if (this.slNo) {
        fixturechecklist001mb.slNo = this.slNo;
        fixturechecklist001mb.unitslno = this.unitslno;
        fixturechecklist001mb.insertUser = this.insertUser;
        fixturechecklist001mb.insertDatetime = this.insertDatetime;
        fixturechecklist001mb.updatedUser = this.authManager.getcurrentUser.username;
        fixturechecklist001mb.updatedDatetime = new Date();
          this.fixturechecklistSettingManager.fixturechecklistupdate(fixturechecklist001mb).subscribe((response) => {
              this.calloutService.showSuccess("Fixture Checklist Details Updated Successfully");
              this.loadData();
              this.fixturechecklistForm.reset();
              this.slNo = null;
              this.submitted = false;
          });
      }
      else {
        fixturechecklist001mb.unitslno= this.user.unitslno;
        fixturechecklist001mb.insertUser = this.authManager.getcurrentUser.username;
        fixturechecklist001mb.insertDatetime = new Date();
          this.fixturechecklistSettingManager.fixturechecklistsave(fixturechecklist001mb).subscribe((response) => {
              this.calloutService.showSuccess("Fixture Checklist Details Saved Successfully");
              this.loadData();
              this.fixturechecklistForm.reset();
              this.submitted = false;
          });
      }
  }
  // --------------------save and update method end----------->
  onReset() {
      this.submitted = false;
      this.fixturechecklistForm.reset();
  }

  onChange() {
      this.fixturechecklistForm.get('fcslno').valueChanges.subscribe((value: any) => {
          for (let fixtureSetting of this.fixtureSettings) {
              if (fixtureSetting.slNo == value) {
                  this.fixturechecklistForm.patchValue({
                      'fname': fixtureSetting.fname
                  });
                  break;
              }
          }
      });
  }

  onViewClick() {
      this.fixturechecklistSettingManager.checklistPdf(this.user.unitslno).subscribe((response) => {
        var blob = new Blob([response], { type: 'application/pdf' });
        var blobURL = URL.createObjectURL(blob);
        window.open(blobURL);
      })
    }
  
    onGeneratePdfReport() {
      this.fixturechecklistSettingManager.checklistPdf(this.user.unitslno).subscribe((response) => {
        saveAs(response, "Checklist-Details");
      })
    }
  
    onGenerateExcelReport() {
      this.fixturechecklistSettingManager.checklistExcel(this.user.unitslno).subscribe((response) => {
       saveAs(response, "Checklist-Details");
        });
    }
}
