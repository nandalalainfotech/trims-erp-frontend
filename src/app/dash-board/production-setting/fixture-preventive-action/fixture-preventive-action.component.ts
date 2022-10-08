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
import { FixturePreventiveaction001mb } from 'src/app/shared/services/restcontroller/entities/fixturepreventiveaction.mb';
import { FixtureRootcause001mb } from 'src/app/shared/services/restcontroller/entities/fixturerootcause.mb';
import { FixtureStatus001mb } from 'src/app/shared/services/restcontroller/entities/FixtureStatusmb';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { Preventiveaction001mb } from 'src/app/shared/services/restcontroller/entities/preventiveaction001mb';
import { Rootcause001mb } from 'src/app/shared/services/restcontroller/entities/Rootcause001mb';
import { Status001mb } from 'src/app/shared/services/restcontroller/entities/status001mb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';
@Component({
  selector: 'app-fixture-preventive-action',
  templateUrl: './fixture-preventive-action.component.html',
  styleUrls: ['./fixture-preventive-action.component.css']
})
export class FixturePreventiveActionComponent implements OnInit {

  public gridOptions: GridOptions | any;
  preventiveActionForm: FormGroup | any;
  frameworkComponents: any;
  submitted = false;
  slNo: number | any;
  sslno: number | any;
  rcslno: number | any;
  name: string = "";
  details: string = "";
  insertUser: string = "";
  insertDatetime: Date | any;
  updatedUser: string | null = "";
  updatedDatetime: Date | any;
  preventiveactionSettings: FixturePreventiveaction001mb[] = [];
  statussets: Status001mb[] = [];
  rootcauses: FixtureRootcause001mb[] = [];
  user?: Login001mb | any;
  unitslno: number | any;

  constructor(private calloutService: CalloutService,
      private authManager: AuthManager,
      private modalService: NgbModal,
      private formBuilder: FormBuilder,
      private fixturepreventiveactionManager: FixturePreventiveactionManager,
      private fixturerootCauseSettingManager: FixtureRootCauseSettingManager,
      private fixturestatusSettingManager: FixtureStatusSettingManager,) {
      this.frameworkComponents = {
          iconRenderer: IconRendererComponent
      }
  }

  ngOnInit(): void {
    this.user = this.authManager.getcurrentUser;

      this.createDataGrid001();
      this.preventiveActionForm = this.formBuilder.group({
          rcslno: ['', Validators.required],
          name: ['', Validators.required],
          details: ['', Validators.required],
          sslno: ['', Validators.required],
      })

      this.fixturestatusSettingManager.allfixturestatus(this.user.unitslno).subscribe(response => {
          this.statussets = deserialize<FixtureStatus001mb[]>(FixtureStatus001mb, response);

      });

      this.fixturerootCauseSettingManager.allfixturerootcause(this.user.unitslno).subscribe(response => {
          this.rootcauses = deserialize<FixtureRootcause001mb[]>(FixtureRootcause001mb, response);
      });

      this.loadData();
  }

  loadData() {
      this.fixturepreventiveactionManager.allfixturepreventiveaction(this.user.unitslno).subscribe(response => {
          this.preventiveactionSettings = deserialize<FixturePreventiveaction001mb[]>(FixturePreventiveaction001mb, response);
          if (this.preventiveactionSettings.length > 0) {
              this.gridOptions?.api?.setRowData(this.preventiveactionSettings);
          } else {
              this.gridOptions?.api?.setRowData([]);
          }
      });
  }

  get f() { return this.preventiveActionForm.controls; }

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
              field: 'rcslno',
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
              field: 'name',
              width: 200,
              flex: 1,
              sortable: true,
              filter: true,
              resizable: true,
              suppressSizeToFit: true,
          },
          {
              headerName: 'Details',
              field: 'details',
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
    return params.data.rcslno ? this.rootcauses.find(x => x.slNo === params.data.rcslno)?.fname : null;
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
      this.preventiveActionForm.patchValue({
          'sslno': params.data.sslno,
          'rcslno': params.data.rcslno,
          'name': params.data.name,
          'details': params.data.details,
      });
  }

  onDeleteButtonClick(params: any) {
      const modalRef = this.modalService.open(ConformationComponent);
      modalRef.componentInstance.details = "Preventive Action Setting";
      modalRef.result.then((data) => {
          if (data == "Yes") {
              this.fixturepreventiveactionManager.preventiveactiondelete(params.data.slNo).subscribe((response) => {
                  for (let i = 0; i < this.preventiveactionSettings.length; i++) {
                      if (this.preventiveactionSettings[i].slNo == params.data.slNo) {
                          this.preventiveactionSettings?.splice(i, 1);
                          break;
                      }
                  }
                  const selectedRows = params.api.getSelectedRows();
                  params.api.applyTransaction({ remove: selectedRows });
                  this.gridOptions.api.deselectAll();
                  this.calloutService.showSuccess("Preventive Action Details Removed Successfully");
              });
          }
      })
  }


  onAuditButtonClick(params: any) {
      const modalRef = this.modalService.open(AuditComponent);
      modalRef.componentInstance.title = "Preventive Action Setting";
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
      this.markFormGroupTouched(this.preventiveActionForm);
      this.submitted = true;
      if (this.preventiveActionForm.invalid) {
          return;
      }
      let fixturepreventiveaction001mb = new FixturePreventiveaction001mb();
      fixturepreventiveaction001mb.rcslno = this.f.rcslno.value ? this.f.rcslno.value : "";
      fixturepreventiveaction001mb.name = this.f.name.value ? this.f.name.value : "";
      fixturepreventiveaction001mb.details = this.f.details.value ? this.f.details.value : "";
      fixturepreventiveaction001mb.sslno = this.f.sslno.value ? this.f.sslno.value : "";
      if (this.slNo) {
        fixturepreventiveaction001mb.slNo = this.slNo;
        fixturepreventiveaction001mb.unitslno = this.unitslno;
        fixturepreventiveaction001mb.insertUser = this.insertUser;
        fixturepreventiveaction001mb.insertDatetime = this.insertDatetime;
        fixturepreventiveaction001mb.updatedUser = this.authManager.getcurrentUser.username;
        fixturepreventiveaction001mb.updatedDatetime = new Date();
          this.fixturepreventiveactionManager.preventiveactionupdate(fixturepreventiveaction001mb).subscribe((response) => {
              this.calloutService.showSuccess("Preventive Action Details Updated Successfully");
              this.loadData();
              this.preventiveActionForm.reset();
              this.slNo = null;
              this.submitted = false;
          });
      }
      else {
        fixturepreventiveaction001mb.unitslno= this.user.unitslno;
        fixturepreventiveaction001mb.insertUser = this.authManager.getcurrentUser.username;
        fixturepreventiveaction001mb.insertDatetime = new Date();
          this.fixturepreventiveactionManager.preventiveactionsave(fixturepreventiveaction001mb).subscribe((response) => {
              this.calloutService.showSuccess("Preventive Action Details Saved Successfully");
              this.loadData();
              this.preventiveActionForm.reset();
              this.submitted = false;
          });
      }
  }

  onReset() {
      this.submitted = false;
      this.preventiveActionForm.reset();
  }
  onViewClick() {
      this.fixturepreventiveactionManager.preventPdf(this.user.unitslno).subscribe((response) => {
        var blob = new Blob([response], { type: 'application/pdf' });
        var blobURL = URL.createObjectURL(blob);
        window.open(blobURL);
      })
    }
  
    onGeneratePdfReport() {
      this.fixturepreventiveactionManager.preventPdf(this.user.unitslno).subscribe((response) => {
        saveAs(response, "Preventiveaction-Details");
      })
    }
  
    onGenerateExcelReport() {
      this.fixturepreventiveactionManager.preventExcel(this.user.unitslno).subscribe((response) => {
       saveAs(response, "Preventiveaction-Details");
        });
    }
  
}
