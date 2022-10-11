import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { PartManager } from 'src/app/shared/services/restcontroller/bizservice/part.service';
import { Part001mb } from 'src/app/shared/services/restcontroller/entities/Part001mb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';
import { DataSharedService } from 'src/app/shared/services/services/datashared.service';
import * as saveAs from 'file-saver';
import { deserialize } from 'serializer.ts/Serializer';
import { PartSpecificationComponent } from 'src/app/shared/part-specification/part-specification.component';
import { Partspecific001wb } from 'src/app/shared/services/restcontroller/entities/partspecifc001wb';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-part-master',
  templateUrl: './part-master.component.html',
  styleUrls: ['./part-master.component.css']
})
export class PartMasterComponent implements OnInit {

  PartForm: FormGroup | any;
  frameworkComponents: any;
  public gridOptions: GridOptions | any;
  submitted = false;

  slNo: number | any;
  partno: string = "";
  partname: string = "";
  splan: string = "";
  descrip: string = "";
  qunty: string = "";
  unitamount: number | any;
  uom: string = "";
  hsn: string = "";
  gst: number | any;
  location?: string;
  mslevel?: string;
  orderlevel?: string;
  leadtime?: string;
  addpopup:string = "";
  insertUser: string = "";
  insertDatetime: Date | any;
  updatedUser: string = "";
  updatedDatetime?: Date | null;
  part001mbs: Part001mb[] = [];
  part001mb?: Part001mb;
  count: number = 0;
  getCount: any;
user?: Login001mb | any;
  unitslno: number | any;
  specifications:Partspecific001wb []=[];
  partspecific ?:Partspecific001wb[] | any;


  constructor(
    private router: Router,
    private datepipe: DatePipe,
    private formBuilder: FormBuilder,
    private calloutService: CalloutService,
    private dataSharedService: DataSharedService,
    private partManager: PartManager,
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

    this.PartForm = this.formBuilder.group({
      partno: ['', Validators.required],
      partname: ['', Validators.required],
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
    this.partManager.allpart(this.user.unitslno).subscribe(response => {
      this.part001mbs = deserialize<Part001mb[]>(Part001mb, response);

      if (this.part001mbs.length > 0) {
        this.gridOptions?.api?.setRowData(this.part001mbs);
      } else {
        this.gridOptions?.api?.setRowData([]);
      }

    });
    this.partManager.getCount().subscribe(response => {
      this.count = response[0].row == 0 ? 1: parseInt(response[0].row) + 1;
      this.PartForm.patchValue({
        partno: String("PRT") + String(this.count).padStart(4, '0')
      });
    });
  }

  get f() { return this.PartForm.controls; }

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
        headerName: 'Part Number',
        field: 'partno',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Part Name',
        field: 'partname',
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
            //  flex: 1,
             sortable: true,
             filter: true,
             resizable: true,
             suppressSizeToFit: true,
           },
           {
             headerName: 'UOM',
             field: 'uom',
             width: 100,
            //  flex: 1,
             sortable: true,
             filter: true,
             resizable: true,
             suppressSizeToFit: true,
           },
           {
             headerName: 'Quantity',
             field: 'qunty',
             width: 100,
            //  flex: 1,
             sortable: true,
             filter: true,
             resizable: true,
             suppressSizeToFit: true,
           },
           {
             headerName: 'GST',
             field: 'gst',
             width: 100,
            //  flex: 1,
             sortable: true,
             filter: true,
             resizable: true,
             suppressSizeToFit: true,
           },
           {
             headerName: 'Unit Rate',
             field: 'unitamount',
             width: 100,
            //  flex: 1,
             sortable: true,
             filter: true,
             resizable: true,
             suppressSizeToFit: true,
           },
           {
             headerName: 'HSN/SAC',
             field: 'hsn',
             width: 100,
            //  flex: 1,
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
    const modalRef = this.modalService.open(PartSpecificationComponent, { windowClass: 'my-class' });
    modalRef.componentInstance.specifications = this.specifications;
    modalRef.componentInstance.PartForm = this.PartForm;
    modalRef.result.then((data) => {
      if (data.status == 'Yes') {
        this.specifications = data.specifications;
      }
    })
  }



  onEditButtonClick(params: any) {
    this.slNo = params.data.slNo;
    this.unitslno = params.data.unitslno;
    this.specifications = params.data.partspecific001wbs;
    this.insertUser = params.data.insertUser;
    this.insertDatetime = params.data.insertDatetime;
    this.PartForm.patchValue({
      'partno': params.data.partno,
      'partname': params.data.partname,
      'splan': params.data.splan,
      'qunty': params.data.qunty,
      'descrip': params.data.descrip,
      'uom': params.data.uom,
      'unitamount': params.data.unitamount,
      'gst': params.data.gst,
      'hsn': params.data.hsn,
      'orderlevel': params.data.orderlevel,
      'leadtime': params.data.leadtime,
      'location': params.data.location,
      'mslevel': params.data.mslevel,
    });
  }

  onDeleteButtonClick(params: any) {
    const modalRef = this.modalService.open(ConformationComponent);
    modalRef.componentInstance.details = "Audit Report";
    modalRef.result.then((data) => {
      if (data == "Yes") {
        this.partManager.partUpdate(params.data.slNo).subscribe((response) => {
          for (let i = 0; i < this.part001mbs.length; i++) {
            if (this.part001mbs[i].slNo == params.data.slNo) {
              this.part001mbs?.splice(i, 1);
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

  onPartClick(event: any, PartForm: any) {
    this.markFormGroupTouched(this.PartForm);
    this.submitted = true;
    if (this.PartForm.invalid) {
      return;
    }
    let part001mb = new Part001mb();

    part001mb.partno = this.f.partno.value ? this.f.partno.value : "";
    part001mb.partname = this.f.partname.value ? this.f.partname.value : "";
    part001mb.splan = this.f.splan.value ? this.f.splan.value : "";
    part001mb.descrip = this.f.descrip.value ? this.f.descrip.value : "";
    part001mb.unitamount = this.f.unitamount.value ? this.f.unitamount.value : "";
    part001mb.qunty = this.f.qunty.value ? this.f.qunty.value : "";
    part001mb.gst = this.f.gst.value ? this.f.gst.value : "";
    part001mb.uom = this.f.uom.value ? this.f.uom.value : "";
    part001mb.hsn = this.f.hsn.value ? this.f.hsn.value : "";
    part001mb.orderlevel = this.f.orderlevel.value ? this.f.orderlevel.value : "";
    part001mb.location = this.f.location.value ? this.f.location.value : "";
    part001mb.leadtime = this.f.leadtime.value ? this.f.leadtime.value : "";
    part001mb.mslevel = this.f.mslevel.value ? this.f.mslevel.value : "";
    part001mb.partspecific001wbs = this.specifications ? this.specifications : 0;


    if (this.slNo) {
      part001mb.slNo = this.slNo;
      part001mb.unitslno = this.unitslno;
      part001mb.insertUser = this.insertUser;
      part001mb.insertDatetime = this.insertDatetime;
      part001mb.updatedUser = this.authManager.getcurrentUser.username;
      part001mb.updatedDatetime = new Date();
      this.partManager.partUpdate(part001mb).subscribe((response) => {
        this.calloutService.showSuccess("Part Details Updated Successfully");
        this.loadData();
        this.PartForm.reset();
        this.specifications=[];
        this.slNo = null;
        this.submitted = false;
      });
    } else {
      part001mb.unitslno= this.user.unitslno;
      part001mb.insertUser = this.authManager.getcurrentUser.username;
      part001mb.insertDatetime = new Date();
      this.partManager.partSave(part001mb).subscribe((response) => {
        this.calloutService.showSuccess("Part Details Saved Successfully");
        this.loadData();
        this.specifications=[];
        this.PartForm.reset();
        this.submitted = false;
      });
    }
  }

  onReset() {
    this.submitted = false;
    this.PartForm.reset();
  }

  onViewClick() {
    this.partManager.partPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  onGeneratePdfReport() {
    this.partManager.partPdf(this.user.unitslno).subscribe((response) => {
      let date= new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Part-Details" + newDate);
    })
  }

  onGenerateExcelReport() {
    this.partManager.partExcel(this.user.unitslno).subscribe((response) => {
      let date= new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Part-Details" + newDate);
    });
  }
}
