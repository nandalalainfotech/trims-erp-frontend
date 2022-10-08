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
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';

@Component({
  selector: 'app-fixture-spare-master',
  templateUrl: './fixture-spare-master.component.html',
  styleUrls: ['./fixture-spare-master.component.css']
})
export class FixtureSpareMasterComponent implements OnInit {

  public gridOptions: GridOptions | any;
  frameworkComponents: any;
  fixturespareSettingForm: FormGroup | any;
  submitted = false;
  slNo: number | any;
  msslno: number | any;
  fname: string = "";
  fspares: string = "";
  fsparescost: number | any;
  fspecification: string = "";
  fleadtime: Date | any;
  fminimumstocklevel: number | any;
  freorderlevel: number | any;
  sslno: number | any;
  insertUser: string = "";
  insertDatetime: Date | any;
  updatedUser: string = "";
  updatedDatetime: Date | any;
  fixturesparesSettings: FixtureSpares001mb[] = [];
  fixturespares001mb?: FixtureSpares001mb;
  fixtureSetting: Fixture001mb[] = [];
  fixture001mb?: Fixture001mb;
  status001mbs?: FixtureStatus001mb[] = [];
  statussets: FixtureStatus001mb[] = [];
  user?: Login001mb | any;
    unitslno: number | any;

  constructor(
      private router: Router,
      private calloutService: CalloutService,
      private fixturesparesettingManager: FixtureSparesettingManager,
      private modalService: NgbModal,
      private formBuilder: FormBuilder,
      private authManager: AuthManager,
      private fixturestatusSettingManager: FixtureStatusSettingManager,
      private fixturesettingManager: FixtureSettingManager,
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
      this.fixturespareSettingForm = this.formBuilder.group({
          msslno: ['', Validators.required],
          fspares: ['', Validators.required],
          fsparescost: ['', Validators.required],
          fname: [''],
          sslno: ['', Validators.required],
          fspecification: ['', Validators.required],
          fleadtime: ['', Validators.required],
          fminimumstocklevel: ['', Validators.required],
          freorderlevel: ['', Validators.required],
      })

      this.fixturestatusSettingManager.allfixturestatus(this.user.unitslno).subscribe(response => {
          this.statussets = deserialize<FixtureStatus001mb[]>(FixtureStatus001mb, response);
      });

      this.fixturesettingManager.findAllSlNoAndMcode(this.user.unitslno).subscribe(response => {
          this.fixtureSetting = deserialize<Fixture001mb[]>(Fixture001mb, response);
      });
      this.loadData();
      this.onChange();
  }

  loadData() {
    this.fixturesparesettingManager.allfixturesparesetting(this.user.unitslno).subscribe(response => {
      this.fixturesparesSettings = deserialize<FixtureSpares001mb[]>(FixtureSpares001mb, response);
      if (this.fixturesparesSettings.length > 0) {
          this.gridOptions?.api?.setRowData(this.fixturesparesSettings);
      } else {
          this.gridOptions?.api?.setRowData([]);
      }

  });
  }

  get f() { return this.fixturespareSettingForm.controls; }

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
              headerName: 'Fixture code',
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
              field: 'fspares',
              width: 200,
              flex: 1,
              sortable: true,
              filter: true,
              resizable: true,
              suppressSizeToFit: true,
          },
          {
              headerName: 'Spares Cost',
              field: 'fsparescost',
              width: 200,
              flex: 1,
              sortable: true,
              filter: true,
              resizable: true,
              suppressSizeToFit: true,
          },
          {
              headerName: 'Specification',
              field: 'fspecification',
              width: 200,
              flex: 1,
              sortable: true,
              filter: true,
              resizable: true,
              suppressSizeToFit: true,
          },
          {
              headerName: 'Lead Time',
              field: 'fleadtime',
              width: 200,
              flex: 1,
              sortable: true,
              filter: true,
              resizable: true,
              suppressSizeToFit: true,
          },
          {
              headerName: 'Minimum Stock Level',
              field: 'fminimumstocklevel',
              width: 200,
              flex: 1,
              sortable: true,
              filter: true,
              resizable: true,
              suppressSizeToFit: true,
            //   cellStyle: (params: { data: { minimumstocklevel: number; }; }) => {
            //       if (params.data.minimumstocklevel < 5) {
            //           return { color: 'red' };
            //       }
            //       return null;
            //   }
          },
          {
              headerName: 'Re-Order Level',
              field: 'freorderlevel',
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
      return params.data.sslno2 ? params.data.sslno2.name : null;
  }

  setFixtureCode(params: any): string {
      return params.data.msslno2 ? params.data.msslno2.fcode : null;
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
      this.fixturespareSettingForm.patchValue({
          'sslno': params.data.sslno,
          'msslno': params.data.msslno,
          'fspares': params.data.fspares,
          'fsparescost': params.data.fsparescost,
          'fspecification': params.data.fspecification,
          'fleadtime': params.data.fleadtime,
          'fminimumstocklevel': params.data.fminimumstocklevel,
          'freorderlevel': params.data.freorderlevel,
      });
  }

  onDeleteButtonClick(params: any) {
      const modalRef = this.modalService.open(ConformationComponent);
      modalRef.componentInstance.details = "Fixture Spare Setting";
      modalRef.result.then((data) => {
          if (data == "Yes") {
              this.fixturesparesettingManager.sparedelete(params.data.slNo).subscribe((response) => {
                  for (let i = 0; i < this.fixturesparesSettings.length; i++) {
                      if (this.fixturesparesSettings[i].slNo == params.data.slNo) {
                          this.fixturesparesSettings?.splice(i, 1);
                          break;
                      }
                  }
                  const selectedRows = params.api.getSelectedRows();
                  params.api.applyTransaction({ remove: selectedRows });
                  this.gridOptions.api.deselectAll();
                  this.calloutService.showSuccess("Fixture Spares Details Removed Successfully");
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
      this.markFormGroupTouched(this.fixturespareSettingForm);
      this.submitted = true;
      if (this.fixturespareSettingForm.invalid) {
          return;
      }
      let fixturespares001mb = new FixtureSpares001mb();
      fixturespares001mb.sslno = this.f.sslno.value ? this.f.sslno.value : "";
      fixturespares001mb.msslno = this.f.msslno.value ? this.f.msslno.value : "";
      fixturespares001mb.fspares = this.f.fspares.value ? this.f.fspares.value : "";
      fixturespares001mb.fsparescost = this.f.fsparescost.value ? this.f.fsparescost.value : 0,
      fixturespares001mb.fspecification = this.f.fspecification.value ? this.f.fspecification.value : "";
      fixturespares001mb.fleadtime = this.f.fleadtime.value ? this.f.fleadtime.value : "";
      fixturespares001mb.fminimumstocklevel = this.f.fminimumstocklevel.value ? this.f.fminimumstocklevel.value : "";
      fixturespares001mb.freorderlevel = this.f.freorderlevel.value ? this.f.freorderlevel.value : "";
      if (this.slNo) {
        fixturespares001mb.slNo = this.slNo;
        fixturespares001mb.unitslno = this.unitslno;
        fixturespares001mb.insertUser = this.insertUser;
        fixturespares001mb.insertDatetime = this.insertDatetime;
        fixturespares001mb.updatedUser = this.authManager.getcurrentUser.username;
        fixturespares001mb.updatedDatetime = new Date();
          this.fixturesparesettingManager.fixturespareupdate(fixturespares001mb).subscribe((response) => {
              this.calloutService.showSuccess("FixtureSpares Details Updated Successfully");
              this.loadData();
              this.fixturespareSettingForm.reset();
              this.slNo = null;
              this.submitted = false;
          });
      } else {
        fixturespares001mb.unitslno= this.user.unitslno;
        fixturespares001mb.insertUser = this.authManager.getcurrentUser.username;
        fixturespares001mb.insertDatetime = new Date();
          this.fixturesparesettingManager.fixturesparesave(fixturespares001mb).subscribe((response) => {
              this.calloutService.showSuccess("FixtureSpares Details Saved Successfully");
              this.loadData();
              this.fixturespareSettingForm.reset();
              this.submitted = false;
          });
      }
  }

  onFirstDataRendered(params: any) {
      params.api.sizeColumnsToFit();
  }

  onReset() {
      this.submitted = false;
      this.fixturespareSettingForm.reset();
  }

  onChange() {
      this.fixturespareSettingForm.get('msslno').valueChanges.subscribe((value: any) => {
          for (let fixtureSetting of this.fixtureSetting) {
              if (fixtureSetting.slNo == value) {
                  this.fixturespareSettingForm.patchValue({
                      'fname': fixtureSetting.fname
                  });
                  break;
              }
          }
      });
  }

  onViewClick() {
      this.fixturesparesettingManager.sparePdf(this.user.unitslno).subscribe((response) => {
        var blob = new Blob([response], { type: 'application/pdf' });
        var blobURL = URL.createObjectURL(blob);
        window.open(blobURL);
      })
    }
  
    onGeneratePdfReport() {
      this.fixturesparesettingManager.sparePdf(this.user.unitslno).subscribe((response) => {
        saveAs(response, "Spares-Details");
      })
    }
  
    onGenerateExcelReport() {
      this.fixturesparesettingManager.spareExcel(this.user.unitslno).subscribe((response) => {
       saveAs(response, "Spares-Details");
        });
    }
  
}
