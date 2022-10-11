import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { deserialize } from 'serializer.ts/Serializer';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { ConsumerSpecificationComponent } from 'src/app/shared/consumer-specification/consumer-specification.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { ConsumbleManager } from 'src/app/shared/services/restcontroller/bizservice/consumble.service';
import { Childpartspecification001wb } from 'src/app/shared/services/restcontroller/entities/childpartsepecific001wb';
import { Consumerspecification001wb } from 'src/app/shared/services/restcontroller/entities/consumablespecific001wb';
import { Consumble001mb } from 'src/app/shared/services/restcontroller/entities/Consumble001mb';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';
import { DataSharedService } from 'src/app/shared/services/services/datashared.service';
import * as saveAs from 'file-saver';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-consumer-master',
  templateUrl: './consumer-master.component.html',
  styleUrls: ['./consumer-master.component.css']
})
export class ConsumerMasterComponent implements OnInit {
  consumableForm: FormGroup | any;
  frameworkComponents: any;
  public gridOptions: GridOptions | any;
  submitted = false;
  slNo: number | any;
  consmno: string = "";
  consname: string = "";
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
  addpopup: string = "";
  insertUser: string = "";;
  insertDatetime: Date | any;
  updatedUser: string = "";
  updatedDatetime?: Date | null;
  consumble001mbs: Consumble001mb [] = [];
  consumble001mb?: Consumble001mb;
  count: number = 0;
  getCount: any; 
 user?: Login001mb | any;
    unitslno: number | any;
  specifications:Consumerspecification001wb [] =[];
  consumerspecification: Consumerspecification001wb[] | any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private calloutService: CalloutService,
    private dataSharedService: DataSharedService,
    private consumbleManager: ConsumbleManager,
    private authManager: AuthManager,
    private modalService: NgbModal,
    private datepipe: DatePipe,
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

    this.consumableForm = this.formBuilder.group({
      consmno: ['', Validators.required],
      consname: ['', Validators.required],
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
    this.consumbleManager.allconsumble(this.user.unitslno).subscribe(response => {
       this.consumble001mbs = deserialize<Consumble001mb[]>(Consumble001mb, response);
    
      if (this.consumble001mbs.length > 0) {
        this.gridOptions?.api?.setRowData(this.consumble001mbs);
      } else {
        this.gridOptions?.api?.setRowData([]);
      }
     
    });
    this.consumbleManager.getCount().subscribe(response => {
      this.count = response[0].row == 0 ? 1: parseInt(response[0].row) + 1;
      this.consumableForm.patchValue({
        consmno: String("CIC") + String(this.count).padStart(4, '0')
      });
    });
  }

  get f() { return this.consumableForm.controls; }

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
        headerName: 'Consumble Number',
        field: 'consmno',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Consumble Name',
        field: 'consname',
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
    const modalRef = this.modalService.open(ConsumerSpecificationComponent, { windowClass: 'my-class' });
    modalRef.componentInstance.specifications = this.specifications;
    modalRef.componentInstance.consumableForm = this.consumableForm;
    modalRef.result.then((data) => {
      if (data.status == 'Yes') {
        this.specifications = data.specifications;



      }
    })
  }

  onEditButtonClick(params: any) {
    this.slNo = params.data.slNo;
    this.unitslno = params.data.unitslno;
    this.specifications = params.data.consumerspecification001wbs;
    this.insertUser = params.data.insertUser;
    this.insertDatetime = params.data.insertDatetime;
    this.consumableForm.patchValue({
      'consmno': params.data.consmno,
      'consname': params.data.consname,
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
        this.consumbleManager.consumbletDelete(params.data.slNo).subscribe((response) => {
          for (let i = 0; i < this.consumble001mbs.length; i++) {
            if (this.consumble001mbs[i].slNo == params.data.slNo) {
              this.consumble001mbs?.splice(i, 1);
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

  onPartClick(event: any, consumableForm: any) {
    this.markFormGroupTouched(this.consumableForm);
    this.submitted = true;
    if (this.consumableForm.invalid) {
      return;
    }
    let consumble001mb = new Consumble001mb();

    consumble001mb.consmno = this.f.consmno.value ? this.f.consmno.value : "";
    consumble001mb.consname = this.f.consname.value ? this.f.consname.value : "";
    consumble001mb.splan = this.f.splan.value ? this.f.splan.value : "";
    consumble001mb.descrip = this.f.descrip.value ? this.f.descrip.value : "";
    consumble001mb.unitamount = this.f.unitamount.value ? this.f.unitamount.value : "";
    consumble001mb.qunty = this.f.qunty.value ? this.f.qunty.value : "";
    consumble001mb.gst = this.f.gst.value ? this.f.gst.value : "";
    consumble001mb.uom = this.f.uom.value ? this.f.uom.value : "";
    consumble001mb.hsn = this.f.hsn.value ? this.f.hsn.value : "";
    consumble001mb.orderlevel = this.f.orderlevel.value ? this.f.orderlevel.value : "";
    consumble001mb.location = this.f.location.value ? this.f.location.value : "";
    consumble001mb.leadtime = this.f.leadtime.value ? this.f.leadtime.value : "";
    consumble001mb.mslevel = this.f.mslevel.value ? this.f.mslevel.value : "";
    consumble001mb.consumerspecification001wbs = this.specifications?this.specifications:0;


    if (this.slNo) {
      consumble001mb.slNo = this.slNo;
      consumble001mb.unitslno = this.unitslno;
      consumble001mb.insertUser = this.insertUser;
      consumble001mb.insertDatetime = this.insertDatetime;
      consumble001mb.updatedUser = this.authManager.getcurrentUser.username;
      consumble001mb.updatedDatetime = new Date();
      this.consumbleManager.consumbleUpdate(consumble001mb).subscribe((response) => {
        this.calloutService.showSuccess("Consumble Details Updated Successfully");
        this.loadData();
        this.consumableForm.reset();
        this.specifications=[];
        this.slNo = null;
        this.submitted = false;
      });
    } else {
      consumble001mb.unitslno= this.user.unitslno;
      consumble001mb.insertUser = this.authManager.getcurrentUser.username;
      consumble001mb.insertDatetime = new Date();
      this.consumbleManager.consumbleSave(consumble001mb).subscribe((response) => {
        this.calloutService.showSuccess("Consumble Details Saved Successfully");
        this.loadData();
        this.specifications=[];
        this.consumableForm.reset();
        this.submitted = false;
      });
    }
  }

  onReset() {
    this.submitted = false;
    this.consumableForm.reset();
  }

  onViewClick() {
    this.consumbleManager.consumblePdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  onGeneratePdfReport() {
    this.consumbleManager.consumblePdf(this.user.unitslno).subscribe((response) => {
      let date= new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Consumable-Item-Details" + newDate);
    })
  }

  onGenerateExcelReport() {
    this.consumbleManager.consumbleExcel(this.user.unitslno).subscribe((response) => {
      let date= new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Consumable-Item-Details" + newDate);
    });
  }


}
