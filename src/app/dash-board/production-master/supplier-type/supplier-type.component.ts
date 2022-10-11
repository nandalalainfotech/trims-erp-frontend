import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { deserialize } from 'serializer.ts/Serializer';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { StatusSettingManager } from 'src/app/shared/services/restcontroller/bizservice/status-setting.service';
import { SupplierTypeManager } from 'src/app/shared/services/restcontroller/bizservice/Suppliertype.service';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { Status001mb } from 'src/app/shared/services/restcontroller/entities/status001mb';
import { Suppliertype001mb } from 'src/app/shared/services/restcontroller/entities/Suppliertype001mb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';
import { DataSharedService } from 'src/app/shared/services/services/datashared.service';

@Component({
  selector: 'app-supplier-type',
  templateUrl: './supplier-type.component.html',
  styleUrls: ['./supplier-type.component.css']
})
export class SupplierTypeComponent implements OnInit {
  frameworkComponents: any;
  supplierTypeForm: FormGroup | any;
  public gridOptions: GridOptions | any;
  submitted = false;

  codeGroup:any;
  slNo: number | any;
  sslno: number | any;
  name: string = "";
  descrip: string = "";
  order: string = "";
  insertUser?: string;
  insertDatetime?: Date;
  updatedUser?: string | null;
  updatedDatetime?: Date | null;
  suppliertype001mbs: Suppliertype001mb[] = [];
  suppliertype001mb?: Suppliertype001mb;
  status001mbs: Status001mb[] = [];
  status001mb?: Status001mb;

  user?: Login001mb | any;
  unitslno: number | any;
  
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private calloutService: CalloutService,
    private dataSharedService: DataSharedService,
    private statusSettingManager: StatusSettingManager,
    private supplierTypeManager: SupplierTypeManager,
    private authManager: AuthManager,
    private modalService: NgbModal,
    private httpClient: HttpClient) {
    this.frameworkComponents = {
      //  linkRenderer: LinkRendererComponent,
      iconRenderer: IconRendererComponent
    }

  }

  ngOnInit(): void {
    this.user = this.authManager.getcurrentUser;

    this.createDataGrid001();
    
    this.loadData()

    this.supplierTypeForm = this.formBuilder.group({
      sslno: ['', Validators.required], 
      name: ['', Validators.required],
      descrip: ['', Validators.required],
      order: ['', Validators.required] 
    })


    this.statusSettingManager.findAllByStatusId().subscribe(response => {
      console.log("response",response);
      
      this.status001mbs = deserialize<Status001mb[]>(Status001mb, response);

    });
  }
  loadData() {
    this.supplierTypeManager.allsuppliertype(this.user.unitslno).subscribe(response => {
       this.suppliertype001mbs = deserialize<Suppliertype001mb[]>(Suppliertype001mb, response);
    
      if (this.suppliertype001mbs.length > 0) {
        this.gridOptions?.api?.setRowData(this.suppliertype001mbs);
      } else {
        this.gridOptions?.api?.setRowData([]);
      }
     
    });
  }

  get f() { return this.supplierTypeForm.controls; }

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
        headerName: 'Name',
        field: 'name',
        width: 200,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        

      },
      {
        headerName: 'Description',
        field: 'descrip',
        width: 200,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,

      },
      {
        headerName: 'Order',
        field: 'order',
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
        width: 100,
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
        width: 105,
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
    return params.data.sslno2 ? params.data.sslno2.name: null;
  }
  onEditButtonClick(params: any) {
    this.slNo = params.data.slNo;
    this.unitslno = params.data.unitslno;
    this.insertUser = params.data.insertUser;
    this.insertDatetime = params.data.insertDatetime;
    this.supplierTypeForm.patchValue({
      'sslno': params.data.sslno,
      'name': params.data.name,
      'descrip': params.data.descrip,
      'order': params.data.order,
    });
  }

  onDeleteButtonClick(params: any) {
    const modalRef = this.modalService.open(ConformationComponent);
    modalRef.componentInstance.details = "Audit Report";
    modalRef.result.then((data) => {
      if (data == "Yes") {
        this.supplierTypeManager.suppliertypdelete(params.data.slNo).subscribe((response) => {
          for (let i = 0; i < this.suppliertype001mbs.length; i++) {
            if (this.suppliertype001mbs[i].slNo == params.data.slNo) {
              this.suppliertype001mbs?.splice(i, 1);
              break;
            }
          }
          const selectedRows = params.api.getSelectedRows();
          params.api.applyTransaction({ remove: selectedRows });
          this.gridOptions.api.deselectAll();
          this.calloutService.showSuccess("Suppliertype Removed Successfully");
        });
      }
    })
  }

  onAuditButtonClick(params: any) {
    const modalRef = this.modalService.open(AuditComponent);
    modalRef.componentInstance.title = "Suppliertype  Report";
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

  onSupplierType(event: any, supplierTypeForm: any) {
    this.markFormGroupTouched(this.supplierTypeForm);
    this.submitted = true;
    if (this.supplierTypeForm.invalid) {
      return;
    }

    let suppliertype001mb = new Suppliertype001mb();

    suppliertype001mb.sslno = this.f.sslno.value ? this.f.sslno.value : "";
    suppliertype001mb.name = this.f.name.value ? this.f.name.value : "";
    suppliertype001mb.descrip = this.f.descrip.value ? this.f.descrip.value : "";
    suppliertype001mb.order = this.f.order.value ? this.f.order.value : "";

    if (this.slNo) {
      suppliertype001mb.slNo = this.slNo;
      suppliertype001mb.unitslno = this.unitslno;
      suppliertype001mb.insertUser = this.insertUser;
      suppliertype001mb.insertDatetime = this.insertDatetime;
      suppliertype001mb.updatedUser = this.authManager.getcurrentUser.username;
      suppliertype001mb.updatedDatetime = new Date();
      this.supplierTypeManager.suppliertypupdate(suppliertype001mb).subscribe((response) => {
        this.calloutService.showSuccess("Suppliertype Updated Successfully");
        this.loadData();
        this.supplierTypeForm.reset();
        this.slNo = null;
        this.submitted = false;
      });
    } else {
      suppliertype001mb.unitslno= this.user.unitslno;
      suppliertype001mb.insertUser = this.authManager.getcurrentUser.username;
      suppliertype001mb.insertDatetime = new Date();
      this.supplierTypeManager.suppliertypsave(suppliertype001mb).subscribe((response) => {
        this.calloutService.showSuccess("Suppliertype Saved Successfully");
        this.loadData();
        this.supplierTypeForm.reset();
        this.submitted = false;
      });
    }
  }

  onReset() {
    this.submitted = false;
    this.supplierTypeForm.reset();
  }
}
