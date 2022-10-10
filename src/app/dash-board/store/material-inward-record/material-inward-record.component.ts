import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { param } from 'jquery';
import { deserialize } from 'serializer.ts/Serializer';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { MaterialInwardManager } from 'src/app/shared/services/restcontroller/bizservice/Materialinward.service';
import { PurchaseorderManager } from 'src/app/shared/services/restcontroller/bizservice/Purchaseorder.service';
import { Materialinward001wb } from 'src/app/shared/services/restcontroller/entities/Materialinward001wb';
import { Purchaseorder001wb } from 'src/app/shared/services/restcontroller/entities/Purchaseorder001wb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';
import * as saveAs from 'file-saver';
import { forkJoin } from 'rxjs';
import { OrderAddItemComponent } from 'src/app/shared/order-add-item/order-add-item.component';
import { OrderItemManager } from 'src/app/shared/services/restcontroller/bizservice/orderitem-wb.service';
import { Orderitem001wb } from 'src/app/shared/services/restcontroller/entities/orderitem001wb';
import { MetriealinwardComponent } from 'src/app/shared/metriealinward/metriealinward.component';
import { Materialreceiveditem001wb } from 'src/app/shared/services/restcontroller/entities/Materialreceiveditem001wb';
import { CompanyDetailsManager } from 'src/app/shared/services/restcontroller/bizservice/Companydetails.service';
import { Companydetails001mb } from 'src/app/shared/services/restcontroller/entities/Companydetails001mb';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { Router } from '@angular/router';


@Component({
  selector: 'app-material-inward-record',
  templateUrl: './material-inward-record.component.html',
  styleUrls: ['./material-inward-record.component.css']
})
export class MaterialInwardRecordComponent implements OnInit {

  frameworkComponents: any;
  public gridOptions: GridOptions | any;
  materialInwardForm: FormGroup | any;
  materialFormArray: FormArray | any;
  submitted = false;
  minDate = new Date();
  maxDate = new Date();
  slNo: number | any;
  purchseSlno: number | any;
  quantySlno: number | any;
  date: Date | any;
  dcNo: string = "";
  supliername: string = "";
  invoiceno: string = "";
  grn: string = "";
  dcDate: Date | any;
  advisedQty: number | any;
  receivedQty: number | any;
  acceptedQty: number | any;
  rejectedQty: number | any;
  outstanding: number | any;
  insertUser: string = "";
  insertDatetime: Date | any;
  updatedUser: string | null = "";
  updatedDatetime: Date | any;
  purOrders: any = [];

  companydetails001mbs: Companydetails001mb[] = [];
  orderItem: Orderitem001wb[] = [];
  orderitem001wb?: Orderitem001wb;
  material: Materialinward001wb[] = [];
  poNumber: Purchaseorder001wb[] = [];
  purchaseorder001wbs: Purchaseorder001wb[] = [];
  purchaseorder001wb?: Purchaseorder001wb;
  materialreceiveditem: Materialreceiveditem001wb[] = [];
  purOrdersNumbers: Purchaseorder001wb[] = [];
  addPopup: any;
  count: any;
  orderitem001wbs: Orderitem001wb[] = [];
  user?: Login001mb | any;
  unitslno: number | any;
  materialrecevied: Materialreceiveditem001wb[] = [];

  constructor(private formBuilder: FormBuilder,
    private authManager: AuthManager,
    private calloutService: CalloutService,
    private modalService: NgbModal,
    private purchaseorderManager: PurchaseorderManager,
    private companyManager: CompanyDetailsManager,
    private router: Router,
    private orderItemManager: OrderItemManager,
    private materialInwardManager: MaterialInwardManager,
    private datepipe: DatePipe) {
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent
    }
  }

  ngOnInit(): void {
    this.user = this.authManager.getcurrentUser;
    this.maxDate.setFullYear(this.maxDate.getFullYear() + 10);
    this.createDataGrid001();
    this.loadData();


    this.purchaseorderManager.allpurchaseorder(this.user.unitslno).subscribe(response => {
      this.purchaseorder001wbs = deserialize<Purchaseorder001wb[]>(Purchaseorder001wb, response);
      for (let i = 0; i < this.purchaseorder001wbs.length; i++) {
        if (this.purchaseorder001wbs[i].status == "Approved") {
          this.purOrdersNumbers.push(this.purchaseorder001wbs[i])
        }

      }

    });

    this.materialInwardForm = this.formBuilder.group({
      purchseSlno: ['', Validators.required],
      date: ['', Validators.required],
      dcNo: ['', Validators.required],
      invoiceno: ['', Validators.required],
      dcDate: ['', Validators.required],
      supliername: [''],
      grn: ['', Validators.required],
      vehicleno: ['', Validators.required],
      drivername: ['', Validators.required],
      driverno: ['',  [Validators.required,Validators.pattern("^[0-9]*$"),Validators.minLength(10), Validators.maxLength(10)]],
      remark: ['', Validators.required],
    })
  }


  get f() { return this.materialInwardForm.controls }

  loadData() {
    this.materialInwardManager.allinward(this.user.unitslno).subscribe(response => {
      this.material = deserialize<Materialinward001wb[]>(Materialinward001wb, response);
      if (this.material.length > 0) {
        this.gridOptions?.api?.setRowData(this.material);
      } else {
        this.gridOptions?.api?.setRowData([]);
      }
    });

    this.materialInwardManager.getCount().subscribe(response => {
      this.count = response[0].row == 0 ? 1 : parseInt(response[0].row) + 1;
      this.materialInwardForm.patchValue({
        grn: String("GRN22JN") + String(this.count).padStart(4, '0')
      });
    });
  }

  createDataGrid001(): void {
    this.gridOptions = {
      paginationPageSize: 10,
      rowSelection: 'single',
      // onFirstDataRendered: this.onFirstDataRendered.bind(this),
    };
    this.gridOptions.editType = 'fullRow';
    this.gridOptions.enableRangeSelection = true;
    this.gridOptions.animateRows = true;
    this.gridOptions.columnDefs = [
      {
        headerName: 'View',
        cellRenderer: 'iconRenderer',
        width: 60,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        cellRendererParams: {
          onClick: this.onViewButtonClick.bind(this),
          label: 'View',
        },

      },
      {
        headerName: 'Pdf',
        cellRenderer: 'iconRenderer',
        width: 60,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        cellRendererParams: {
          onClick: this.onPdfButtonClick.bind(this),
          label: 'Pdf',
        },

      },
      {
        headerName: 'Excel',
        cellRenderer: 'iconRenderer',
        width: 60,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        cellRendererParams: {
          onClick: this.onEXcelButtonClick.bind(this),
          label: 'Excel',
        },
      },
      {
        headerName: 'Remarks',
        field: 'remarks',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Status',
        field: 'status',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
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

      {
        headerName: 'P.O No',
        field: 'purchseSlno',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: this.setPONO.bind(this)
      },

      {
        headerName: 'Goods Received Number',
        field: 'grn',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Supplier Name',
        field: 'supliername',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        // valueGetter: this.setSupplierName.bind(this)
      },
      {
        headerName: 'Date',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: (params: any) => {
          return params.data.date ? this.datepipe.transform(params.data.date, 'dd-MM-yyyy') : '';
        }
      },
      {
        headerName: 'D.C No',
        field: 'dcNo',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Invoice No',
        field: 'invoiceno',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'D.C Date',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: (params: any) => {
          return params.data.dcDate ? this.datepipe.transform(params.data.dcDate, 'dd-MM-yyyy') : '';
        }
      },
      {
        headerName: 'Vehicle No',
        field: 'vehicleno',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Driver ame',
        field: 'drivername',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Driver Contact No',
        field: 'driverno',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Remarks',
        field: 'remark',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
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

  // setPonocode(params: any): string {
  //   return params.data.purchseSlno ? this.purchaseorder001wbs.find(x => x.slNo === params.data.purchseSlno)?.pono : null;
  // }

  setPONO(params: any): string {
    return params.data.purchseSlno2 ?  params.data.purchseSlno2.pono :null;

  }

  rowClicked(params: any) {
    params.node.setData({
      ...params.data,
      name: true,
    });
  }

  getRowStyle(params) {
    if (params.data.status == 'Approved') {
      return { 'background-color': 'lightgreen' };
    } else if (params.data.status == 'Partially Approved') {
      return { 'background-color': '#FFFF00' };
    } else if (params.data.status == 'Hold') {
      return { 'background-color': 'lightblue' };
    } else if (params.data.status == 'Reject') {
      return { 'background-color': '#ff8080' };
    } else if (params.data.status == 'Request For Inspection') {
      return { 'background-color': '#FFA500' };
    } else if (params.data.status == 'Waiting For Request') {
      return { 'background-color': '#FF69B4' };
    }
    return true;
  }

  onAuditButtonClick(params: any) {
    const modalRef = this.modalService.open(AuditComponent);
    modalRef.componentInstance.title = "Material Inward Record";
    modalRef.componentInstance.details = params.data
  }

  onEditButtonClick(params: any) {
    if (params.data.status != 'Approved') {
      this.slNo = params.data.slNo;
      this.unitslno = params.data.unitslno;
      this.insertUser = params.data.insertUser;
      this.insertDatetime = params.data.insertDatetime;
      this.materialreceiveditem = params.data.materialreceiveditem001wbs;
      this.materialInwardForm.patchValue({
        'date': new Date(params.data.date),
        'supliername': params.data.supliername,
        'purchseSlno': params.data.purchseSlno,
        'dcNo': params.data.dcNo,
        'dcDate': new Date(params.data.dcDate),
        'grn': params.data.grn,
        'invoiceno': params.data.invoiceno,
        'vehicleno': params.data.vehicleno,
        'drivername': params.data.drivername,
        'driverno': params.data.driverno,
        'remark': params.data.remark,
      });
    }
    else {
      this.calloutService.showWarning("This Material Inward Record Already Approved. We are not able to approved again");
    }
  }

  // onAddbuttonClick(event: any) {
  // const modalRef = this.modalService.open(MetriealinwardComponent, { windowClass: 'my-class' });
  //   modalRef.componentInstance.poNumber = event.target.value;
  //   modalRef.componentInstance.materialreceiveditem = this.materialreceiveditem;
  //   modalRef.result.then((data) => {
  //     if (data.status == 'Yes') {
  //       this.materialreceiveditem = data.materialreceiveditem;
  //     }
  //   })
  // }

  onDeleteButtonClick(params: any) {
    if (params.data.status != 'Approved') {
      const modalRef = this.modalService.open(ConformationComponent);
      modalRef.componentInstance.details = "Material Inward Record";
      modalRef.result.then((data) => {
        if (data == "Yes") {
          this.materialInwardManager.inwardDelete(params.data.slNo).subscribe((response) => {
            for (let i = 0; i < this.material.length; i++) {
              if (this.material[i].slNo == params.data.slNo) {
                this.material?.splice(i, 1);
                break;
              }
            }
            const selectedRows = params.api.getSelectedRows();
            params.api.applyTransaction({ remove: selectedRows });
            this.gridOptions.api.deselectAll();
            this.calloutService.showSuccess("Material Inward Record Removed Successfully");
          });
        }
      })
    }
    else {
      this.calloutService.showWarning("This Material Inward Record Already Approved. We are not able to delete");
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onMaterialInwardClick(event: any, materialInwardForm: any) {
    this.markFormGroupTouched(this.materialInwardForm);
    this.submitted = true;
    if (this.materialInwardForm.invalid) {
      return;
    }

    let materialinward001wb = new Materialinward001wb();
    materialinward001wb.purchseSlno = this.f.purchseSlno.value ? this.f.purchseSlno.value : "";
    materialinward001wb.date = new Date(this.f.date.value);
    materialinward001wb.dcNo = this.f.dcNo.value ? this.f.dcNo.value : "Na";
    materialinward001wb.invoiceno = this.f.invoiceno.value ? this.f.invoiceno.value : "Na";
    materialinward001wb.supliername = this.f.supliername.value ? this.f.supliername.value : "";
    materialinward001wb.dcDate = this.f.dcDate.value ? this.f.dcDate.value : "";
    materialinward001wb.grn = this.f.grn.value ? this.f.grn.value : "";
    materialinward001wb.vehicleno = this.f.vehicleno.value ? this.f.vehicleno.value : "";
    materialinward001wb.drivername = this.f.drivername.value ? this.f.drivername.value : "";
    materialinward001wb.driverno = this.f.driverno.value ? this.f.driverno.value : "";
    materialinward001wb.remark = this.f.remark.value ? this.f.remark.value : "";
    materialinward001wb.materialreceiveditem001wbs = this.materialreceiveditem ? this.materialreceiveditem : 0;
    materialinward001wb.status = "Waiting For Request"
    if (this.slNo) {
      materialinward001wb.slNo = this.slNo;
      materialinward001wb.unitslno = this.unitslno;
      materialinward001wb.insertUser = this.insertUser;
      materialinward001wb.insertDatetime = this.insertDatetime;
      // materialinward001wb.metriealitems = this.materialreceiveditem;
      materialinward001wb.updatedUser = this.authManager.getcurrentUser.username;
      materialinward001wb.updatedDatetime = new Date();

      this.materialInwardManager.inwardUpdate(materialinward001wb).subscribe((response) => {
        this.calloutService.showSuccess("Material Inward Record Updated Successfully");
        this.materialInwardForm.reset();
        this.materialreceiveditem = [];
        this.loadData();
        this.slNo = null;
        this.submitted = false;
      });
    } else {
      // materialinward001wb.date = new Date();
      // materialinward001wb.dcDate = new Date();
      materialinward001wb.unitslno = this.user.unitslno;
      materialinward001wb.insertUser = this.authManager.getcurrentUser.username;
      materialinward001wb.insertDatetime = new Date();
      this.materialInwardManager.inwardSave(materialinward001wb).subscribe((response) => {
        this.calloutService.showSuccess("Material Inward Record Saved Successfully");
        this.materialInwardForm.reset();
        this.materialreceiveditem = [];
        this.loadData();
        this.submitted = false;
      });
    }
  }

  onReset() {
    this.submitted = false;
    this.materialInwardForm.reset();
  }

  onDcClick() {
    console.log("onDcClick");
    this.materialInwardForm.get('invoiceno').disable();
    // this.materialInwardForm.get('invoiceno').disable();
  }
  onInvoiceClick() {
    console.log("onInvoiceClick");
    this.materialInwardForm.get('dcNo').disable();
  }

  onChangePONumber(event: any) {
    this.purchaseorderManager.findOne(event.target.value).subscribe(response => {
      this.purchaseorder001wb = deserialize<Purchaseorder001wb>(Purchaseorder001wb, response);
      this.materialInwardForm.patchValue({
        "supliername": this.purchaseorder001wb.suplierName
      })
    });
  }

  onAddbuttonClick(event: any) {
    let order: any = [];
    let consumer: any = [];
    let childpart: any = [];
    let part: any = [];
    let suplier = "";
    this.purchaseorderManager.findOne(this.f.purchseSlno.value).subscribe(response => {
      this.purchaseorder001wb = deserialize<Purchaseorder001wb>(Purchaseorder001wb, response);

      for (let i = 0; i < this.purchaseorder001wb.orderitem001wbs.length; i++) {
        if (this.purchaseorder001wb.orderitem001wbs[i].itemcode) {
          order.push(this.purchaseorder001wb.orderitem001wbs[i].itemcode);

        }
        if (this.purchaseorder001wb.orderitem001wbs[i].cucode) {
          consumer.push(this.purchaseorder001wb.orderitem001wbs[i].cucode);
        }
        if (this.purchaseorder001wb.orderitem001wbs[i].cptcode) {
          childpart.push(this.purchaseorder001wb.orderitem001wbs[i].cptcode);
        }
        if (this.purchaseorder001wb.orderitem001wbs[i].prtcode) {
          part.push(this.purchaseorder001wb.orderitem001wbs[i].prtcode);
        }
      }


      if (order.length > 0) {
        suplier = "Raw Material";
      }
      if (consumer.length > 0) {
        suplier = "Consumable Item";
      }
      if (childpart.length > 0) {
        suplier = "Child Part";
      }
      if (part.length > 0) {
        suplier = "Part";
      }
      const modalRef = this.modalService.open(MetriealinwardComponent, { windowClass: 'my-class' });
      modalRef.componentInstance.poNumber = this.f.purchseSlno.value;
      modalRef.componentInstance.suplier = suplier;
      modalRef.componentInstance.materialreceiveditem = this.materialreceiveditem;
      modalRef.result.then((data) => {
        if (data.status == 'Yes') {
          this.materialreceiveditem = data.materialreceiveditem;
        }
      })
    });

  }

  onChanges(event: any) {
    this.orderItemManager.findOne(event.target.value).subscribe(response => {
      this.orderitem001wb = deserialize<Orderitem001wb>(Orderitem001wb, response);
      this.materialInwardForm.patchValue({
        'advisedQty': this.orderitem001wb.qunty
      })
    });
  }

  onBlurEvent(event: any) {
    if (this.f.receivedQty.value && this.f.acceptedQty.value && this.f.advisedQty.value) {
      let receivedQty: number = this.f.receivedQty.value ? this.f.receivedQty.value : 0;
      let acceptedQty: number = this.f.acceptedQty.value ? this.f.acceptedQty.value : 0;
      let advisedQty: number = this.f.advisedQty.value ? this.f.advisedQty.value : 0;
      let rejectedQty = receivedQty - acceptedQty;
      let outstanding = advisedQty - receivedQty;
      let outstanding1 = outstanding + rejectedQty
      this.materialInwardForm.patchValue({
        'rejectedQty': rejectedQty,
        'outstanding': outstanding1
      })
    }
  }

  onViewClick() {
    this.materialInwardManager.materialinwardPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  onGeneratePdfReport() {
    this.materialInwardManager.materialinwardPdf(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Material_Inward_Details" + newdate);
    })
  }

  onGenerateExcelReport() {
    this.materialInwardManager.materialinwardExcel(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Material_Inward_Details" + newdate);
    });
  }

  onViewButtonClick(params: any) {
    this.materialInwardManager.pdfId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })

  }
  onPdfButtonClick(params: any) {
    this.materialInwardManager.pdfId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, params.data.grn + "  " + newDate);
    })

  }
  onEXcelButtonClick(params: any) {
    this.materialInwardManager.ExcelId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, params.data.grn + "  " + newDate);
    })

  }


  onStatusClick() {
    // this.materialInwardManager.allinward(this.user.unitslno).subscribe(response => {
    //   this.material = deserialize<Materialinward001wb[]>(Materialinward001wb, response);
    //   let materialinward001wb = new Materialinward001wb();
    //   for (let i = 0; i <1; i++) {
    //     console.log("i============>>>",i);
        
    //     materialinward001wb = this.material[i]
    //     console.log("materialinward001wb=====================>>>",materialinward001wb);
        
    //     materialinward001wb.status = "Request For Inspection"
    //     this.materialInwardManager.inwardUpdate(materialinward001wb).subscribe((response) => {
    //       console.log("response",response);
          
    //       this.calloutService.showInfo(" Send The Request For Inspection");
    //     });
    //   }
    //   this.loadData();
    // });

    this.router.navigate(["/app-dash-board/app-quality/app-quality-checking"]);
  }


}
