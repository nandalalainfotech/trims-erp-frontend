import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { forkJoin } from 'rxjs';
import { deserialize } from 'serializer.ts/Serializer';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { PurchaseInvoicesItemsComponent } from 'src/app/shared/purchase-invoices-items/purchase-invoices-items.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { MaterialInspectionManager } from 'src/app/shared/services/restcontroller/bizservice/Materialinspection.service';
import { MaterialInwardManager } from 'src/app/shared/services/restcontroller/bizservice/Materialinward.service';
import { PurchaseInvoicePayManager } from 'src/app/shared/services/restcontroller/bizservice/PurchaseInvoicePay.service';
import { PurchaseorderManager } from 'src/app/shared/services/restcontroller/bizservice/Purchaseorder.service';
import { PurchasereqslipManager } from 'src/app/shared/services/restcontroller/bizservice/Purchasereqslip.service';
import { SupplierQuotationManager } from 'src/app/shared/services/restcontroller/bizservice/supplierquotation.service';
import { SupplierRegManager } from 'src/app/shared/services/restcontroller/bizservice/supplierReg.service';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { Materialinspection001wb } from 'src/app/shared/services/restcontroller/entities/MaterialInspection001wb';
import { Materialinward001wb } from 'src/app/shared/services/restcontroller/entities/Materialinward001wb';
import { Purchaseinvoicepay001wb } from 'src/app/shared/services/restcontroller/entities/purchaseinvoicepay001wb';
import { Purchaseorder001wb } from 'src/app/shared/services/restcontroller/entities/Purchaseorder001wb';
import { Purchasereqslip001wb } from 'src/app/shared/services/restcontroller/entities/Purchasereqslip001wb';
import { Supplierquotation001wb } from 'src/app/shared/services/restcontroller/entities/supplierquotation001wb ';
import { Supplierregistration001mb } from 'src/app/shared/services/restcontroller/entities/supplierRegistration001mb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-purchase-invoice',
  templateUrl: './purchase-invoice.component.html',
  styleUrls: ['./purchase-invoice.component.css']
})
export class PurchaseInvoiceComponent implements OnInit {

  frameworkComponents: any;
  public gridOptions: GridOptions | any;
  purchaseInvoiceForm: FormGroup | any;

  slNo?: number | any;
  cDate?: Date;
  poSlno?: number;
  prsNo?: number;
  grnNo?: number;
  suppliercode?: number;
  suppliername?: string = "";
  purchaseInvoice?: string = "";
  reqDate?: Date;
  incomingNo?: string = "";
  filename: string = "";
  filepath: string = "";
  originalfilename: string = "";
  insertUser?: string;
  insertDatetime?: Date;
  updatedUser?: string | null;
  updatedDatetime?: Date | null;
  purchaseItem: any;
  submitted = false;
  minDate = new Date();
  maxDate = new Date();
  selectedFile: any;
  purchaseinvoicepay: Purchaseinvoicepay001wb[] = [];
  purchaseorder001wbs: Purchaseorder001wb[] = [];
  purchaseorder001wb?: Purchaseorder001wb;
  materialinspection001wbs: Materialinspection001wb[] = [];
  materialinspection001wb?: Materialinspection001wb;
  purchasereqs: Purchasereqslip001wb[] = [];
  supplierregs: Supplierregistration001mb[] = [];
  supplierquotations: Supplierquotation001wb[] = [];
  materialinward001wbs: Materialinward001wb[] = [];
  user?: Login001mb | any;
  unitslno: number | any;

  constructor(private formBuilder: FormBuilder,
    private authManager: AuthManager,
    private calloutService: CalloutService,
    private purchaseInvoicePayManager: PurchaseInvoicePayManager,
    private modalService: NgbModal,
    private purchaseorderManager: PurchaseorderManager,
    private materialInspectionManager: MaterialInspectionManager,
    private datepipe: DatePipe,
    private router: Router,
    private purchaseregslipManager: PurchasereqslipManager,
    private supplierRegManager: SupplierRegManager,
    private supplierQuotationManager: SupplierQuotationManager,
    private materialInwardManager: MaterialInwardManager,
  ) {
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent
    }
  }

  ngOnInit(): void {
    this.user = this.authManager.getcurrentUser;

    this.maxDate.setFullYear(this.maxDate.getFullYear() + 10);
    this.createDataGrid001();
    // this.loadData();


    this.purchaseorderManager.allpurchaseorder(this.user.unitslno).subscribe(response => {
      this.purchaseorder001wbs = deserialize<Purchaseorder001wb[]>(Purchaseorder001wb, response);


    });

    this.materialInspectionManager.materialinspectionfindall(this.user.unitslno).subscribe(response => {
      this.materialinspection001wbs = deserialize<Materialinspection001wb[]>(Materialinspection001wb, response);
    });

    this.purchaseregslipManager.allpurchaseslip(this.user.unitslno).subscribe(response => {
      this.purchasereqs = deserialize<Purchasereqslip001wb[]>(Purchasereqslip001wb, response);



    });

    this.supplierRegManager.allSupplier(this.user.unitslno).subscribe(response => {
      this.supplierregs = deserialize<Supplierregistration001mb[]>(Supplierregistration001mb, response);

    });

    this.supplierQuotationManager.allSupplierQuotation(this.user.unitslno).subscribe(response => {
      this.supplierquotations = deserialize<Supplierquotation001wb[]>(Supplierquotation001wb, response);
    });

    this.materialInwardManager.allinward(this.user.unitslno).subscribe(response => {
      this.materialinward001wbs = deserialize<Materialinward001wb[]>(Materialinward001wb, response);
    });

    this.purchaseInvoiceForm = this.formBuilder.group({
      cDate: [this.datepipe.transform(new Date(), 'dd-MM-yyyy')],
      poSlno: ['', Validators.required],
      prsNo: ['', Validators.required],
      grnNo: ['', Validators.required],
      suppliername: ['', Validators.required],
      suppliercode: ['', Validators.required],
      purchaseInvoice: ['', Validators.required],
      reqDate: ['',],
      incomingNo: ['', Validators.required],
      filename: ['', Validators.required],
      status: ['',],
      // remarks: ['',],
    })

    this.loadData();

  }

  loadData() {
    this.purchaseInvoicePayManager.allPurchaseInvoicePay(this.user.unitslno).subscribe(response => {
      this.purchaseinvoicepay = deserialize<Purchaseinvoicepay001wb[]>(Purchaseinvoicepay001wb, response);
      if (this.purchaseinvoicepay.length > 0) {
        this.gridOptions?.api?.setRowData(this.purchaseinvoicepay);
      } else {
        this.gridOptions?.api?.setRowData([]);
      }
    });
  }

  get f() { return this.purchaseInvoiceForm.controls }

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
        headerName: 'Date',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: (params: any) => {
          return params.data.cDate ? this.datepipe.transform(params.data.cDate, 'dd-MM-yyyy') : '';
        }
      },
      {
        headerName: 'PO No',
        field: "poSlno",
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: this.setPONo.bind(this)
      },
      {
        headerName: 'PRS No',
        // field: 'prsNo',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: this.setPRSNo.bind(this)
      },
      {
        headerName: 'GRS NO',
        field: 'grnNo',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: this.setGRN.bind(this)
      },
      {
        headerName: 'Supplier code',
        field: 'suppliercode',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: this.setSupplierCode.bind(this)
      },
      {
        headerName: 'Supplier Name',
        field: 'suppliername',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        // valueGetter: this.setSupplierName.bind(this)
      },
      {
        headerName: 'Purchase Invoice No',
        field: 'purchaseInvoice',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Requried Date',
        // field: 'reqDate',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: (params: any) => {
          return params.data.reqDate ? this.datepipe.transform(params.data.reqDate, 'dd-MM-yyyy') : '';
        }
      },

      {
        headerName: 'Incoming Inspection No',
        field: 'incomingNo',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,

      },

      // {
      //   headerName: 'File Document ',
      //   width: 200,
      //   // flex: 1,
      //   sortable: true,
      //   filter: true,
      //   resizable: true,
      //   suppressSizeToFit: true,
      //   // valueGetter: this.setfile.bind(this)

      //   // valueGetter: this.setlegaldocuments.bind(this),


      // },
      {
        headerName: 'File Name',
        field: 'filename',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: "",
        headerComponentParams: { template: '<span><i class="fa fa-download"></i></span>' },
        cellRenderer: 'iconRenderer',
        // flex: 1,
        width: 50,
        suppressSizeToFit: true,
        cellRendererParams: {
          label: 'File3'

        },
      },
      // {
      //   headerName: 'Edit',
      //   cellRenderer: 'iconRenderer',
      //   width: 80,
      //   // flex: 1,
      //   suppressSizeToFit: true,
      //   cellStyle: { textAlign: 'center' },
      //   cellRendererParams: {
      //     onClick: this.onEditButtonClick.bind(this),
      //     label: 'Edit'
      //   },
      // },
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

  setPONo(params: any): string {
    return params.data.poSlno ? params.data.poSlno2?.pono : null;
  }

  setPRSNo(params: any): string {
    return params.data.prsNo ? this.purchasereqs.find(x => x.slNo === params.data.prsNo)?.prsNo : null;
  }

  setGRN(params: any): string {
    // this.grnNo = this.f.poSlno.value ? this.materialinward001wbs.find(x => x.purchseSlno == this.f.poSlno.value)?.grn : null;
    return params.data.grnNo ? this.materialinward001wbs.find(x => x.slNo === params.data.grnNo)?.grn : "";
  }

  setSupplierCode(params: any): string {
    let supCode = params.data.suppliercode ? this.supplierquotations.find(x => x.slNo === params.data.suppliercode)?.supplierSlno : null;
    return supCode ? this.supplierregs.find(x => x.slNo === supCode)?.supplierCode : null;
    // return params.data.suppliercode ? this.supplierregs.find(x => x.slNo === params.data.suppliercode)?.supplierCode : "";
  }

  onAuditButtonClick(params: any) {
    const modalRef = this.modalService.open(AuditComponent);
    modalRef.componentInstance.title = "Supplier Quotation";
    modalRef.componentInstance.details = params.data
  }

  onEditButtonClick(params: any) {
    this.slNo = params.data.slNo;
    this.unitslno = params.data.unitslno;
    this.insertUser = params.data.insertUser;
    this.insertDatetime = params.data.insertDatetime;
    let supCode = params.data.suppliercode ? this.supplierquotations.find(x => x.slNo === params.data.suppliercode)?.supplierSlno : null;
    this.grnNo = params.data.grnNo ? this.materialinward001wbs.find(x => x.purchseSlno == params.data.grnNo)?.grn : null;
    this.purchaseInvoiceForm.patchValue({
      'cDate': this.datepipe.transform(new Date(params.data.cDate), 'dd-MM-yyyy'),
      'poSlno': params.data.poSlno,
      // 'prsNo': params.data.prsNo,
      'prsNo': params.data.prsNo ? this.purchasereqs.find(x => x.slNo === params.data.prsNo)?.prsNo : null,
      // 'grnNo': params.data.grnNo,
      'grnNo': this.grnNo,
      'suppliercode':supCode ? this.supplierregs.find(x => x.slNo === supCode)?.supplierCode : null,
      // 'suppliercode': params.data.suppliercode,
      'suppliername': params.data.suppliername,
      'purchaseInvoice': params.data.purchaseInvoice,
      'reqDate': new Date(params.data.reqDate),
      'incomingNo': params.data.incomingNo,

    });
  }
  onFileSelected(event: any) {
    let fileList: FileList = event.target.files;

    if (fileList.length > 0) {
      this.selectedFile = fileList[0];
    }
  }

  onDeleteButtonClick(params: any) {
    const modalRef = this.modalService.open(ConformationComponent);
    modalRef.componentInstance.details = "Purchase Invoice";
    modalRef.result.then((data) => {
      if (data == "Yes") {
        this.purchaseInvoicePayManager.PurchaseInvoicePayDelete(params.data.slNo).subscribe((response) => {
          for (let i = 0; i < this.purchaseinvoicepay.length; i++) {
            if (this.purchaseinvoicepay[i].slNo == params.data.slNo) {
              this.purchaseinvoicepay?.splice(i, 1);
              break;
            }
          }
          const selectedRows = params.api.getSelectedRows();
          params.api.applyTransaction({ remove: selectedRows });
          this.gridOptions.api.deselectAll();
          this.calloutService.showSuccess("Purchase Invoice Removed Successfully");
        });
      }
    })
  }


  AddPopup(event: any) {
    let order: any = [];
    let consumer: any = [];
    let childpart: any = [];
    let part: any = [];
    let suplier = "";

    this.purchaseorderManager.findOne(this.f.poSlno.value).subscribe(response => {
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

      const modalRef = this.modalService.open(PurchaseInvoicesItemsComponent, { windowClass: 'my-class' });
      modalRef.componentInstance.prsNumber = this.f.poSlno.value;
      modalRef.componentInstance.purchaseItem = this.purchaseItem;
      modalRef.componentInstance.suplier = suplier;
      modalRef.result.then((data) => {
        if (data.status == 'Yes') {
          this.purchaseItem = data.purchaseItem;
        }
      })

    });


  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onPurchaseClick(event: any, purchaseInvoiceForm: any) {
    this.markFormGroupTouched(this.purchaseInvoiceForm);
    this.submitted = true;
    if (this.purchaseInvoiceForm.invalid) {
      return;
    }

    let purchaseinvoicepay001wb = new Purchaseinvoicepay001wb();
    purchaseinvoicepay001wb.cDate = new Date(this.f.cDate.value);
    purchaseinvoicepay001wb.poSlno = this.f.poSlno.value ? this.f.poSlno.value : "";
    purchaseinvoicepay001wb.prsNo = this.f.prsNo.value ? this.purchaseorder001wb?.prsno : null;
    // purchaseinvoicepay001wb.grnNo = this.f.grnNo.value ? this.f.grnNo.value : "";
    purchaseinvoicepay001wb.grnNo= this.f.grnNo.value ? this.materialinward001wbs.find(x => x.grn === this.f.grnNo.value)?.slNo : null;
    purchaseinvoicepay001wb.suppliercode = this.f.suppliercode.value ? this.purchaseorder001wb?.suplierSlno : null;
    purchaseinvoicepay001wb.suppliername = this.f.suppliername.value ? this.f.suppliername.value : "";
    purchaseinvoicepay001wb.purchaseInvoice = this.f.purchaseInvoice.value ? this.f.purchaseInvoice.value : "";
    purchaseinvoicepay001wb.reqDate = new Date(this.f.reqDate.value);
    purchaseinvoicepay001wb.incomingNo = this.f.incomingNo.value ? this.f.incomingNo.value : "";
    purchaseinvoicepay001wb.remarks = " No";
    purchaseinvoicepay001wb.status = "Request For Approval";
    purchaseinvoicepay001wb.filename = this.f.filename.value ? this.f.filename.value : "";
    purchaseinvoicepay001wb.purchaseItem = this.purchaseItem?this.purchaseItem:0;

    if (this.slNo) {

      purchaseinvoicepay001wb.slNo = this.slNo;
      purchaseinvoicepay001wb.unitslno = this.unitslno;
      purchaseinvoicepay001wb.insertUser = this.insertUser;
      purchaseinvoicepay001wb.insertDatetime = this.insertDatetime;
      purchaseinvoicepay001wb.updatedUser = this.authManager.getcurrentUser.username;
      purchaseinvoicepay001wb.updatedDatetime = new Date();

      let rep0 = this.purchaseInvoicePayManager.purchaseinvoicepayUpdate(purchaseinvoicepay001wb);

      forkJoin([rep0]).subscribe((data: any) => {
        this.purchaseinvoicepay = deserialize<Purchaseinvoicepay001wb[]>(Purchaseinvoicepay001wb, data[0]);
        let purchaseinvoicSlno = data[0].slNo;

        this.purchaseInvoicePayManager.purchaseinvoicpayFileUpdate(purchaseinvoicSlno, this.selectedFile).subscribe((response) => {
          this.calloutService.showSuccess("Purchase Invoices Updated Successfully");
          this.purchaseInvoiceForm.reset();
          this.purchaseItem=[];
          this.purchaseInvoiceForm.patchValue(
            { cDate: this.datepipe.transform(new Date(), 'dd-MM-yyyy') }
          );
          this.submitted = false;
          this.loadData();
        });

      });

    } else {
      purchaseinvoicepay001wb.cDate = new Date();
      purchaseinvoicepay001wb.reqDate = new Date(this.f.reqDate.value);
      purchaseinvoicepay001wb.unitslno = this.user.unitslno;
      purchaseinvoicepay001wb.insertUser = this.authManager.getcurrentUser.username;
      purchaseinvoicepay001wb.insertDatetime = new Date();

      let rep0 = this.purchaseInvoicePayManager.purchaseinvoicpaySave(purchaseinvoicepay001wb);

      forkJoin([rep0]).subscribe((data: any) => {
        this.purchaseinvoicepay = deserialize<Purchaseinvoicepay001wb[]>(Purchaseinvoicepay001wb, data[0]);
        let purchaseinvoicSlno = data[0].slNo;

        this.purchaseInvoicePayManager.purchaseinvoicpayFileSave(purchaseinvoicSlno, this.selectedFile).subscribe((response) => {
          this.calloutService.showSuccess("Purchase Invoices Saved Successfully");
          this.purchaseInvoiceForm.reset();
          this.purchaseItem=[];
          this.purchaseInvoiceForm.patchValue(
            { cDate: this.datepipe.transform(new Date(), 'dd-MM-yyyy') }
          );
          this.submitted = false;
          this.loadData();
        });

      });
    }


  }

  onChange(event: any) {

    this.purchaseorderManager.findOne(event.target.value).subscribe(response => {
      this.purchaseorder001wb = deserialize<Purchaseorder001wb>(Purchaseorder001wb, response);
      let supCode = this.purchaseorder001wb.suplierSlno ? this.supplierquotations.find(x => x.slNo === this.purchaseorder001wb?.suplierSlno)?.supplierSlno : null;
      
      this.grnNo = this.f.poSlno.value ? this.materialinward001wbs.find(x => x.purchseSlno == this.f.poSlno.value)?.grn : null;

      let incomingNo = this.f.poSlno.value ? this.materialinward001wbs.find(x => x.purchseSlno == this.f.poSlno.value)?.slNo : null;

      this.purchaseInvoiceForm.patchValue({
        'prsNo': this.purchaseorder001wb.prsno ? this.purchasereqs.find(x => x.slNo === this.purchaseorder001wb?.prsno)?.prsNo : null,
        'grnNo': this.grnNo,
        'suppliername': this.purchaseorder001wb.suplierName,
        'suppliercode': supCode ? this.supplierregs.find(x => x.slNo === supCode)?.supplierCode : null,
        // 'suppliercode': this.purchaseorder001wb.suplierSlno,
        'incomingNo': incomingNo ? this.materialinspection001wbs.find(x => x.grnumber == incomingNo)?.iirno : null,

      })

    });

  }

  onChangegrs(event: any) {
    this.materialInspectionManager.findOne(event.target.value).subscribe(response => {
      this.materialinspection001wb = deserialize<Materialinspection001wb>(Materialinspection001wb, response);

      this.purchaseInvoiceForm.patchValue({
        // 'incomingNo': this.materialinspection001wb.iirno,
        // 'incomingNo': this.materialinspection001wb.iirno?this.materialinspection001wb.find(x => x.slNo ===this.materialinspection001wb?.slNo)?.iirno : null,

      })
    });

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
    }
    return true;
  }


  onReset() {
    this.submitted = false;
    // this.purchaseInvoiceForm.controls.cDate.reset();
    this.purchaseInvoiceForm.controls.poSlno.reset();
    this.purchaseInvoiceForm.controls.prsNo.reset();
    this.purchaseInvoiceForm.controls.grnNo.reset();
    this.purchaseInvoiceForm.controls.suppliercode.reset();
    this.purchaseInvoiceForm.controls.suppliername.reset();
    this.purchaseInvoiceForm.controls.purchaseInvoice.reset();
    this.purchaseInvoiceForm.controls.reqDate.reset();
    this.purchaseInvoiceForm.controls.incomingNo.reset();
    this.purchaseInvoiceForm.controls.remarks.reset();
    this.purchaseInvoiceForm.controls.status.reset();
    this.purchaseInvoiceForm.controls.filename.reset();
  }

  onViewClick() {
    this.purchaseInvoicePayManager.purchasInvoicePdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  onGeneratePdfReport() {
    this.purchaseInvoicePayManager.purchasInvoicePdf(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "purchaseInvoice" + newdate);
    })
  }

  onGenerateExcelReport() {
    this.purchaseInvoicePayManager.purchasInvoiceExcel(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "purchaseInvoice" + newdate);
    })
  }

  onViewButtonClick(params: any) {
    this.purchaseInvoicePayManager.purchasInvoicepdfId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })

  }

  onPdfButtonClick(params: any) {
    this.purchaseInvoicePayManager.purchasInvoicepdfId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, params.data.poSlno2.pono + "  " + newDate);
    })

  }
  onEXcelButtonClick(params: any) {
    this.purchaseInvoicePayManager.purchasInvoiceExcelId(params.data.slNo, this.user.unitslno).subscribe((response) => {

      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, params.data.poSlno2.pono + "  " + newDate);
    })

  }
  onStatusClick() {

    this.router.navigate(["/app-dash-board/app-approval/app-approval-request"]);
  }

}
