import { DatePipe } from '@angular/common';
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
import { FixtureSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturesetting.service';
import { FixtureStatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/fixturestatus.service';
import { MachineSettingManager } from 'src/app/shared/services/restcontroller/bizservice/machine-setting.service';
import { StatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/status-setting.service';
import { ToolsMasterSettingManager } from 'src/app/shared/services/restcontroller/bizservice/toolsmaster.service';
import { ToolsStatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/toolsstatus.service';
import { Fixture001mb } from 'src/app/shared/services/restcontroller/entities/Fixture001mb';
import { FixtureStatus001mb } from 'src/app/shared/services/restcontroller/entities/FixtureStatusmb';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { Machine001mb } from 'src/app/shared/services/restcontroller/entities/Machine001mb';
import { Status001mb } from 'src/app/shared/services/restcontroller/entities/status001mb';
import { Toolsmaster001mb } from 'src/app/shared/services/restcontroller/entities/toolsmaster001mb';
import { ToolsStatus001mb } from 'src/app/shared/services/restcontroller/entities/toolsstatus001mb';
import { BaseService } from 'src/app/shared/services/services/base.service';
import { CalloutService } from 'src/app/shared/services/services/callout.service';
import { DataSharedService } from 'src/app/shared/services/services/datashared.service';

@Component({
  selector: 'app-tools-master',
  templateUrl: './tools-master.component.html',
  styleUrls: ['./tools-master.component.css']
})
export class ToolsMasterComponent implements OnInit {
  frameworkComponents: any;
  public gridOptions: GridOptions | any;
  listOftoolsForm: FormGroup | any;
  slNo: number | any;
  tsslno: number | any;
  submitted = false;
  tcode: string = "";
  tname: string = "";
  tyear: string = "";
  tcapacity: string = "";
  ttype: string = "";
  tmake: string = "";
  tlocation: string = "";
  insertUser: string = "";
  insertDatetime: Date | any;
  updatedUser: string = "";
  updatedDatetime: Date | any;
  toolsSetting: Toolsmaster001mb[] = [];
  toolsmaster001mb?: Toolsmaster001mb;
  toolsmaster001mbs?: ToolsStatus001mb[] = [];
  statussets: ToolsStatus001mb[] = [];
  count: number = 0;
  getCount: any;
  user?: Login001mb | any;
    unitslno: number | any;
    
  constructor(private router: Router, 
    private toolsMasterSettingManager: ToolsMasterSettingManager,
    private calloutService: CalloutService,
    private authManager: AuthManager,
    private datepipe: DatePipe,
    private dataSharedService: DataSharedService,
    private authManger: AuthManager,
    private toolsStatusSettingManager: ToolsStatusSettingManager,
    private formBuilder: FormBuilder,
    private baseService: BaseService,
    private modalService: NgbModal,
    private httpClient: HttpClient, private http: HttpClient) {
    this.frameworkComponents = {
      //  linkRenderer: LinkRendererComponent,
      iconRenderer: IconRendererComponent
    }

  }

  ngOnInit(): void {
    this.user = this.authManager.getcurrentUser;

    this.createDataGrid001();
    this.listOftoolsForm = this.formBuilder.group({
      tcode: ['',],
      tname: ['', Validators.required],
      tsslno: ['',Validators.required],
      tyear: ['', Validators.required],
      tcapacity: ['', Validators.required],
      ttype: ['', Validators.required],
      tmake: ['', Validators.required],
      tlocation: ['', Validators.required],
    })

    this.toolsStatusSettingManager.alltoolsstatus(this.user.unitslno).subscribe(response => {
      this.statussets = deserialize<ToolsStatus001mb[]>(ToolsStatus001mb, response);
    });

    this.loadData();
  }


  loadData() {
    this.toolsMasterSettingManager.alltoolsmaster(this.user.unitslno).subscribe(response => {
      this.toolsSetting = deserialize<Toolsmaster001mb[]>(Toolsmaster001mb, response);
      if (this.toolsSetting.length > 0) {
        this.gridOptions?.api?.setRowData(this.toolsSetting);
      } else {
        this.gridOptions?.api?.setRowData([]);
      }
    });

    this.toolsMasterSettingManager.getCount().subscribe(response => {
      this.count = response[0].row;
      this.listOftoolsForm.patchValue({
        tcode: String("SE/TD/00") + String(this.count).padStart(1, '0')
      });
    });
  }
  get f() { return this.listOftoolsForm.controls; }



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
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true
      },
      {
        headerName: 'Tools Code',
        field: 'tcode',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true
      },
      {
        headerName: 'Tools Name',
        field: 'tname',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true
      },
      {
        headerName: 'Year of Purchase',
        field: 'tyear',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellClass: "grid-cell-centered",
        suppressSizeToFit: true
      },
      {
        headerName: 'Capacity',
        field: 'tcapacity',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true
      },
      {
        headerName: 'Type/Size',
        field: 'ttype',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true
      },
      {
        headerName: 'Make',
        field: 'tmake',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true
      },
      {
        headerName: 'Location',
        field: 'tlocation',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true
      },
      {
        headerName: 'Status',
        width: 200,
        // flex: 1,
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
        // flex: 1,
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
        // flex: 1,
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
        // flex: 1,
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

  onEditButtonClick(params: any) {
    // params.colDef.cellRendererParams.isActive = false
    this.slNo = params.data.slNo;
    this.unitslno = params.data.unitslno;
    this.insertUser = params.data.insertUser;
    this.insertDatetime = params.data.insertDatetime;
    this.listOftoolsForm.patchValue({
      'tsslno': params.data.tsslno,
      'tcode': params.data.tcode,
      'tname': params.data.tname,
      'tyear': params.data.tyear,
      'tcapacity': params.data.tcapacity,
      'ttype': params.data.ttype,
      'tmake': params.data.tmake,
      'tlocation': params.data.tlocation,
    });
  }

  onDeleteButtonClick(params: any) {
    const modalRef = this.modalService.open(ConformationComponent);
    modalRef.componentInstance.details = "Tools Master Settings";
    modalRef.result.then((data) => {
      if (data == "Yes") {
        this.toolsMasterSettingManager.toolsdelete(params.data.slNo).subscribe((response) => {
          for (let i = 0; i < this.toolsSetting.length; i++) {
            if (this.toolsSetting[i].slNo == params.data.slNo) {
              this.toolsSetting?.splice(i, 1);
              break;
            }
          }
          const selectedRows = params.api.getSelectedRows();
          params.api.applyTransaction({ remove: selectedRows });
          this.calloutService.showSuccess("Tools Details Removed Successfully");
        });
      }
    })
  }

  onAuditButtonClick(params: any) {
    const modalRef = this.modalService.open(AuditComponent);
    modalRef.componentInstance.title = "Tools Settings";
    modalRef.componentInstance.details = params.data
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onToolsClick(event: any, listOfFixtureForm: any) {
  
    
    this.markFormGroupTouched(this.listOftoolsForm);
    this.submitted = true;
    if (this.listOftoolsForm.invalid) {
      return;
    }
    let toolsmaster001mb = new Toolsmaster001mb();
    toolsmaster001mb.tsslno = this.f.tsslno.value ? this.f.tsslno.value : "";
    toolsmaster001mb.tcode = this.f.tcode.value ? this.f.tcode.value : "";
    toolsmaster001mb.tname = this.f.tname.value ? this.f.tname.value : "";
    toolsmaster001mb.tyear = this.f.tyear.value ? this.f.tyear.value : "";
    toolsmaster001mb.tcapacity = this.f.tcapacity.value ? this.f.tcapacity.value : "";
    toolsmaster001mb.ttype = this.f.ttype.value ? this.f.ttype.value : "";
    toolsmaster001mb.tmake = this.f.tmake.value ? this.f.tmake.value : "";
    toolsmaster001mb.tlocation = this.f.tlocation.value ? this.f.tlocation.value : "";
    if (this.slNo) {
      toolsmaster001mb.slNo = this.slNo;
      toolsmaster001mb.unitslno = this.unitslno;
      toolsmaster001mb.insertUser = this.insertUser;
      toolsmaster001mb.insertDatetime = this.insertDatetime;
      toolsmaster001mb.updatedUser = this.authManager.getcurrentUser.username;
      toolsmaster001mb.updatedDatetime = new Date();
      this.toolsMasterSettingManager.toolsupdate(toolsmaster001mb).subscribe((response) => {
        this.calloutService.showSuccess("Tools Details Updated Successfully");
        this.loadData();
        this.listOftoolsForm.reset();
        this.slNo = null;
        this.submitted = false;
      });
    } else {
      toolsmaster001mb.unitslno= this.user.unitslno;
      toolsmaster001mb.insertUser = this.authManager.getcurrentUser.username;
      toolsmaster001mb.insertDatetime = new Date();
      this.toolsMasterSettingManager.toolssave(toolsmaster001mb).subscribe((response) => {

        this.calloutService.showSuccess("Tools Details Saved Successfully");
        this.loadData();
        this.listOftoolsForm.reset();
        this.submitted = false;
      });
    }

  }


  onReset() {
    this.submitted = false;
    this.listOftoolsForm.reset();
  }
  onViewClick() {
    this.toolsMasterSettingManager.toolsPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  onGeneratePdfReport() {
    this.toolsMasterSettingManager.toolsPdf(this.user.unitslno).subscribe((response) => {
      saveAs(response, "Tools Master-Details");
    })
  }

  onGenerateExcelReport() {
    this.toolsMasterSettingManager.toolsExcel(this.user.unitslno).subscribe((response) => {
     saveAs(response, "Tools Master-Details");
      });
  }

}

