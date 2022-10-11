import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { ChildPartManager } from 'src/app/shared/services/restcontroller/bizservice/ChildPart.service';
import { ChildPart001mb } from 'src/app/shared/services/restcontroller/entities/ChildPart001mb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';
import { DataSharedService } from 'src/app/shared/services/services/datashared.service';
import * as saveAs from 'file-saver';
import { deserialize } from 'serializer.ts/Serializer';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ChildpartSpecificationComponent } from 'src/app/shared/childpart-specification/childpart-specification.component';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { DatePipe } from '@angular/common';
import { Childpartspecification001wb } from 'src/app/shared/services/restcontroller/entities/childpartsepecific001wb';

@Component({
  selector: 'app-child-part',
  templateUrl: './child-part.component.html',
  styleUrls: ['./child-part.component.css']
})
export class ChildPartComponent implements OnInit {


  childPartForm: FormGroup | any;
  frameworkComponents: any;
  public gridOptions: GridOptions | any;
  submitted = false;

  slNo: number | any;
  cpartno: string = "";
  cpartname: string = "";
  splan: string = "";
  descrip: string = "";
  qunty: string = "";
  hsn: string = "";
  unitamount: number | any;
  uom: string = "";
  location?: string;
  mslevel?: string;
  orderlevel?: string;
  leadtime?: string;
  gst: number | any;
  insertUser: string = "";
  addpopup: string = "";
  insertDatetime: Date | any;
  updatedUser: string = "";
  updatedDatetime?: Date | null;
  childPart001mbs: ChildPart001mb[] = [];
  childPart001mb?: ChildPart001mb;
  count: number = 0;
  getCount: any;
  user?: Login001mb | any;
  unitslno: number | any;
  specifications: Childpartspecification001wb[]=[];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private datepipe: DatePipe,
    private calloutService: CalloutService,
    private dataSharedService: DataSharedService,
    private authManager: AuthManager,
    private childPartManager: ChildPartManager,
    private modalService: NgbModal,
    private httpClient: HttpClient) {
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent
    }

  }

  ngOnInit(): void {
    this.user = this.authManager.getcurrentUser;

    this.createDataGrid001();

    this.loadData()

    this.childPartForm = this.formBuilder.group({
      cpartno: ['', Validators.required],
      cpartname: ['', Validators.required],
      splan: ['', Validators.required],
      descrip: ['', Validators.required],
      unitamount: ['', Validators.required],
      uom: ['', Validators.required],
      gst: ['', Validators.required],
      qunty: ['', Validators.required],
      hsn: ['', Validators.required],
      location: ['', Validators.required],
      mslevel: ['', Validators.required],
      orderlevel: ['', Validators.required],
      leadtime: ['', Validators.required],
    })

  }

  loadData() {
    this.childPartManager.allChildpart(this.user.unitslno).subscribe(response => {
      this.childPart001mbs = deserialize<ChildPart001mb[]>(ChildPart001mb, response);

      if (this.childPart001mbs.length > 0) {
        this.gridOptions?.api?.setRowData(this.childPart001mbs);
      } else {
        this.gridOptions?.api?.setRowData([]);
      }

    });
    this.childPartManager.getCount().subscribe(response => {
      this.count = response[0].row == 0 ? 1 : parseInt(response[0].row) + 1;
      this.childPartForm.patchValue({
        cpartno: String("CPT") + String(this.count).padStart(4, '0')
      });
    });
  }

  get f() { return this.childPartForm.controls; }

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
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true
      },

      {
        headerName: 'C Part Number',
        field: 'cpartno',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Child Part Name',
        field: 'cpartname',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },

      {
        headerName: 'Sampling Plan',
        field: 'splan',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Item Description',
        field: 'descrip',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'UOM',
        field: 'uom',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Quantity',
        field: 'qunty',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'GST',
        field: 'gst',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Unit Rate',
        field: 'unitamount',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'HSN/SAC',
        field: 'hsn',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Location',
        field: 'location',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'M.S.Level',
        field: 'mslevel',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Re-Oreder Level',
        field: 'orderlevel',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Lead Time',
        field: 'leadtime',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },

      {
        headerName: 'Edit',
        cellRenderer: 'iconRenderer',
        width: 100,
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
        width: 105,
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

  onAddbuttonClick(object: any) {
    const modalRef = this.modalService.open(ChildpartSpecificationComponent, { windowClass: 'my-class' });
    modalRef.componentInstance.specifications = this.specifications;
    modalRef.componentInstance.childPartForm = this.childPartForm;
    modalRef.result.then((data) => {
      if (data.status == 'Yes') {
        this.specifications = data.specifications;
      }
    })
  }

  onEditButtonClick(params: any) {
    this.slNo = params.data.slNo;
    this.unitslno = params.data.unitslno;
    this.specifications = params.data.childpartspecification001wbs;
    this.insertUser = params.data.insertUser;
    this.insertDatetime = params.data.insertDatetime;
    this.childPartForm.patchValue({
      'cpartno': params.data.cpartno,
      'cpartname': params.data.cpartname,
      'splan': params.data.splan,
      'qunty': params.data.qunty,
      'descrip': params.data.descrip,
      'uom': params.data.uom,
      'unitamount': params.data.unitamount,
      'gst': params.data.gst,
      'hsn': params.data.hsn,
      'orderlevel': params.data.orderlevel,
      'location': params.data.location,
      'leadtime': params.data.leadtime,
      'mslevel': params.data.mslevel,
    });
  }

  onDeleteButtonClick(params: any) {
    const modalRef = this.modalService.open(ConformationComponent);
    modalRef.componentInstance.details = "Audit Report";
    modalRef.result.then((data) => {
      if (data == "Yes") {
        this.childPartManager.ChildpartUpdate(params.data.slNo).subscribe((response) => {
          for (let i = 0; i < this.childPart001mbs.length; i++) {
            if (this.childPart001mbs[i].slNo == params.data.slNo) {
              this.childPart001mbs?.splice(i, 1);
              break;
            }
          }
          const selectedRows = params.api.getSelectedRows();
          params.api.applyTransaction({ remove: selectedRows });
          this.gridOptions.api.deselectAll();
          this.calloutService.showSuccess("Child Part Details Removed Successfully");
        });
      }
    })
  }

  onAuditButtonClick(params: any) {
    const modalRef = this.modalService.open(AuditComponent);
    modalRef.componentInstance.title = "Child Part Details Report";
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

  onchildPartClick(event: any, childPartForm: any) {
    this.markFormGroupTouched(this.childPartForm);
    this.submitted = true;
    if (this.childPartForm.invalid) {
      return;
    }

    let childPart001mb = new ChildPart001mb();

    childPart001mb.cpartno = this.f.cpartno.value ? this.f.cpartno.value : "";
    childPart001mb.cpartname = this.f.cpartname.value ? this.f.cpartname.value : "";
    childPart001mb.splan = this.f.splan.value ? this.f.splan.value : "";
    childPart001mb.descrip = this.f.descrip.value ? this.f.descrip.value : "";
    childPart001mb.unitamount = this.f.unitamount.value ? this.f.unitamount.value : "";
    childPart001mb.qunty = this.f.qunty.value ? this.f.qunty.value : "";
    childPart001mb.gst = this.f.gst.value ? this.f.gst.value : "";
    childPart001mb.uom = this.f.uom.value ? this.f.uom.value : "";
    childPart001mb.hsn = this.f.hsn.value ? this.f.hsn.value : "";
    childPart001mb.orderlevel = this.f.orderlevel.value ? this.f.orderlevel.value : "";
    childPart001mb.location = this.f.location.value ? this.f.location.value : "";
    childPart001mb.leadtime = this.f.leadtime.value ? this.f.leadtime.value : "";
    childPart001mb.mslevel = this.f.mslevel.value ? this.f.mslevel.value : "";
    childPart001mb.childpartspecification001wbs = this.specifications ? this.specifications : 0;


    if (this.slNo) {
      childPart001mb.slNo = this.slNo;
      childPart001mb.unitslno = this.unitslno;
      childPart001mb.insertUser = this.insertUser;
      childPart001mb.insertDatetime = this.insertDatetime;
      childPart001mb.updatedUser = this.authManager.getcurrentUser.username;
      childPart001mb.updatedDatetime = new Date();
      this.childPartManager.ChildpartUpdate(childPart001mb).subscribe((response) => {
        this.calloutService.showSuccess("Child Part Details Updated Successfully");
        this.loadData();
        this.childPartForm.reset();
        this.specifications = [];
        this.slNo = null;
        this.submitted = false;
      });
    } else {
      childPart001mb.unitslno = this.user.unitslno;
      childPart001mb.insertUser = this.authManager.getcurrentUser.username;
      childPart001mb.insertDatetime = new Date();
      this.childPartManager.ChildpartSave(childPart001mb).subscribe((response) => {
        this.calloutService.showSuccess("Child Part Details Saved Successfully");
        this.loadData();
        this.childPartForm.reset();
        this.specifications = [];
        this.submitted = false;
      });
    }
  }

  onReset() {
    this.submitted = false;
    this.childPartForm.reset();
  }

  onViewClick() {
    this.childPartManager.ChildpartPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  onGeneratePdfReport() {
    this.childPartManager.ChildpartPdf(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Child Part Details" + newDate);
    })
  }

  onGenerateExcelReport() {
    this.childPartManager.ChildpartExcel(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Child Part Details" + newDate);
    });
  }

}
