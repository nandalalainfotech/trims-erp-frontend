import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { deserialize } from 'serializer.ts/Serializer';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { CustmerRegManager } from 'src/app/shared/services/restcontroller/bizservice/CustemerRegistration.service';
import { CustomerConsigneeManager } from 'src/app/shared/services/restcontroller/bizservice/customer-consignee.service';
import { SalesQuotationManager } from 'src/app/shared/services/restcontroller/bizservice/salesQuotation.service';
import { Custemer001wb } from 'src/app/shared/services/restcontroller/entities/Custemer001wb';
import { Custemerregistration001mb } from 'src/app/shared/services/restcontroller/entities/Custemerregistration001mb';
import { Customerconsignee001mb } from 'src/app/shared/services/restcontroller/entities/Customerconsignee001mb';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { Salesinvoice001wb } from 'src/app/shared/services/restcontroller/entities/Salesinvoice001wb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';
import { saveAs } from 'file-saver';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { CustemerAddComponent } from 'src/app/shared/custemer-add/custemer-add.component';
import { SalesQuotation001wb } from 'src/app/shared/services/restcontroller/entities/salesQuotation001wb';
import { PartItemComponent } from 'src/app/shared/part-item/part-item.component';

@Component({
  selector: 'app-sales-quotation',
  templateUrl: './sales-quotation.component.html',
  styleUrls: ['./sales-quotation.component.css']
})
export class SalesQuotationComponent implements OnInit {
 
  frameworkComponents: any;
  public gridOptions: GridOptions | any;
  salesQuotationForm: FormGroup | any;
  submitted = false;
  minDate = new Date();
  maxDate = new Date();
  slNo: number | any;
  custemerCode: string |any;
  sInvoice: string |any;
  date: Date | any;
  custmrSlno: number | any;
  consignee: string = "";
  cDate: Date | any;
  purreqSlno: number | any;
  addPopup: string = "";
  pono: string = "";
  refno: string = "";
  otherRef: string = "";
  dispatchThrough: string = "";
  destination: string = "";
  termsDelivery: string = "";
  supplierFrom: string = "";
  hsn: string = "";
  partNo: string = "";
  remarks?: string | null;
  statusSlno?: number | null;
  status: string = "";
  getCount: any;
  dueOn: Date | any;
  amount: number | any;
  insertUser: string = "";
  insertDatetime: Date | any;
  updatedUser: string | null = "";
  updatedDatetime: Date | any;
  SalesQuotation: SalesQuotation001wb[] = [];
  Custemerregs: Custemerregistration001mb[] = [];
  Custemerreg?:Custemerregistration001mb;
  Custemer001wbs: Custemer001wb[] = [];
  Custemer001wb?: Custemer001wb;
  customerConsignees: Customerconsignee001mb[] = [];
  customerConsignee?:Customerconsignee001mb;
  consignees: Customerconsignee001mb[] = [];
  customerconsignee001mbs: Customerconsignee001mb[] = [];

  partItem: any;
  count: number = 0;
  custemeradds: any;
  user?: Login001mb | any;
  unitslno: number | any;


  constructor(private formBuilder: FormBuilder,
    private authManager: AuthManager,
    private calloutService: CalloutService,
    private modalService: NgbModal,
    private datepipe: DatePipe,
    private salesQuotationManager: SalesQuotationManager,
    private custmerRegManager: CustmerRegManager,
    private customerConsigneeManager: CustomerConsigneeManager,
    private router: Router) {
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent
    }
  }

  ngOnInit(): void {

    this.user = this.authManager.getcurrentUser;
    this.createDataGrid001();
    this.maxDate.setFullYear(this.maxDate.getFullYear() + 10);
    this.loadData();
    this.salesQuotationForm = this.formBuilder.group({
      custemerCode: ['',],
      custmrSlno: ['',Validators.required],
      sInvoice: ['',],
      cDate:  [this.datepipe.transform(new Date(), 'dd-MM-yyyy')],
      consignee: ['',Validators.required],
      date: ['', Validators.required],
      otherRef: ['', Validators.required],
      pono: ['', Validators.required],
      refno: ['',Validators.required],
      remarks: ['',],
      statusSlno: ['',],
      dispatchThrough: ['', Validators.required],
      destination: ['', Validators.required],
      termsDelivery: ['', Validators.required],
      supplierFrom: ['', Validators.required],
      hsn: ['', Validators.required],
      dueOn: ['', Validators.required],



    })

    this.custmerRegManager.allCustmerreg(this.user.unitslno).subscribe(response => {
      this.Custemerregs = deserialize<Custemerregistration001mb[]>(Custemerregistration001mb, response);
    });


    this.customerConsigneeManager.allCustomerConsignee(this.user.unitslno).subscribe(response => {
      this.customerConsignees = deserialize<Customerconsignee001mb[]>(Customerconsignee001mb, response);
      
    });

  }

  loadData() {

    this.salesQuotationManager.allsalesquotation(this.user.unitslno).subscribe(response => {
      this.SalesQuotation = deserialize<SalesQuotation001wb[]>(SalesQuotation001wb, response);
      
      if (this.SalesQuotation.length > 0) {
        this.gridOptions?.api?.setRowData(this.SalesQuotation);
      } else {
        this.gridOptions?.api?.setRowData([]);
      }
    });
    this.salesQuotationManager.getCount().subscribe(response => {
      this.count = response[0].row == 0 ? 1 : parseInt(response[0].row) + 1;
      this.salesQuotationForm.patchValue({
        pono: String("GST/2708/22-23/") + String(this.count).padStart(4, '0')
      });
    });
    this.salesQuotationManager.getCount1().subscribe(response => {
      this.count = response[0].row == 0 ? 1 : parseInt(response[0].row) + 1;
      this.salesQuotationForm.patchValue({
        sInvoice: String("ST/22-23/") + String(this.count).padStart(5, '0')
      });
    });
  }

  get f() { return this.salesQuotationForm.controls }

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
        headerName: 'Customer Code',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: this.setCustemercode.bind(this)
      },
      {
        headerName: 'Sales Invoice No',
        field: "sInvoice",
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        // valueGetter: this.setCustemercode.bind(this)
      },

      {
        headerName: 'Invoice Date',
        // field: "cDate",
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
        headerName: 'Custemer Name',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: this.setInvoiceTo.bind(this)
      },

     

      {
        headerName: 'Consignee Name',
        field: "consignee",
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        // valueGetter: this.setConsigneeNo.bind(this)
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
        headerName: 'PO No',
        field: "pono",
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        // valueGetter: this.setVoucherNo.bind(this)
      },
      {
        headerName: 'Reference No',
        field: "refno",
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        // valueGetter: this.setRefNo.bind(this)
      },
      {
        headerName: 'Other Reference',
        field: "otherRef",
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Dispatch Through',
        field: 'dispatchThrough',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Destination',
        field: 'destination',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Terms Of Delivery',
        field: 'termsDelivery',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'supplier From',
        field: 'supplierFrom',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'HSN/SAC',
        field: 'hsn',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Due On',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: (params: any) => {
          return params.data.dueOn ? this.datepipe.transform(params.data.dueOn, 'dd-MM-yyyy') : '';
        }
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


    ];
  }

  setCustemercode(params: any): string {
    return params.data.custmrSlno2 ? params.data.custmrSlno2.custemercode : null;
  }
  setInvoiceTo(params: any): string {
    return params.data.custmrSlno2 ? params.data.custmrSlno2.custemername : null;
  }

  setConsigneeNo(params: any): string {
    return params.data.custmrSlno2 ? params.data.custmrSlno2.consignee : null;
  }

  onAuditButtonClick(params: any) {
    const modalRef = this.modalService.open(AuditComponent);
    modalRef.componentInstance.title = "Purchase Order";
    modalRef.componentInstance.details = params.data
  }

  onAddbuttonClick(object: any) {
    const modalRef = this.modalService.open(PartItemComponent, { windowClass: 'my-class' });
    modalRef.componentInstance.partItem = this.partItem;
    modalRef.result.then((data) => {
      if (data.status == 'Yes') {
        
        this.partItem = data.partItem;
        
      }
    })
  }

  onEditButtonClick(params: any) {
    this.slNo = params.data.slNo;
    this.unitslno = params.data.unitslno;
    this.insertUser = params.data.insertUser;
    this.insertDatetime = params.data.insertDatetime;
    this.salesQuotationForm.patchValue({
      'custmrSlno': params.data.custmrSlno,
      'consignee': params.data.consignee,
      'custemerCode': params.data.custemerCode,
      'sInvoice': params.data.sInvoice,
      'cDate': new Date(params.data.cDate),
      'date': new Date(params.data.date),
      'pono': params.data.pono,
      'refno': params.data.refno,
      'otherRef': params.data.otherRef,
      'dispatchThrough': params.data.dispatchThrough,
      'destination': params.data.destination,
      'termsDelivery': params.data.termsDelivery,
      'supplierFrom': params.data.supplierFrom,
      'hsn': params.data.hsn,
      'dueOn': new Date(params.data.dueOn),



    });
  }

  onDeleteButtonClick(params: any) {
    const modalRef = this.modalService.open(ConformationComponent);
    modalRef.componentInstance.details = "Purchase Order";
    modalRef.result.then((data) => {
      if (data == "Yes") {
        this.salesQuotationManager.salesquotationdelete(params.data.slNo).subscribe((response) => {
          for (let i = 0; i < this.SalesQuotation.length; i++) {
            if (this.SalesQuotation[i].slNo == params.data.slNo) {
              this.SalesQuotation?.splice(i, 1);
              break;
            }
          }
          const selectedRows = params.api.getSelectedRows();
          params.api.applyTransaction({ remove: selectedRows });
          this.gridOptions.api.deselectAll();
          this.calloutService.showSuccess("Sales Quotation Removed Successfully");
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

  onsalesQuotationClick(event: any, salesQuotationForm: any) {
    this.markFormGroupTouched(this.salesQuotationForm);
    this.submitted = true;
    if (this.salesQuotationForm.invalid) {
      return;
    }

    let salesQuotation001wb = new SalesQuotation001wb();
    salesQuotation001wb.custmrSlno = this.f.custmrSlno.value ? this.f.custmrSlno.value : "";
    
    salesQuotation001wb.custemerCode = this.f.custemerCode.value ? this.f.custemerCode.value : "";
    salesQuotation001wb.sInvoice = this.f.sInvoice.value ? this.f.sInvoice.value : "";
    salesQuotation001wb.cDate = new Date(this.f.cDate.value);
    salesQuotation001wb.consignee = this.f.consignee.value ? this.f.consignee.value : "";
    salesQuotation001wb.date = new Date(this.f.date.value);
    salesQuotation001wb.pono = this.f.pono.value ? this.f.pono.value : "";
    salesQuotation001wb.refno = this.f.refno.value ? this.f.refno.value : "Na";
    salesQuotation001wb.otherRef = this.f.otherRef.value ? this.f.otherRef.value : "";
    salesQuotation001wb.dispatchThrough = this.f.dispatchThrough.value ? this.f.dispatchThrough.value : "";
    salesQuotation001wb.destination = this.f.destination.value ? this.f.destination.value : "";
    salesQuotation001wb.termsDelivery = this.f.termsDelivery.value ? this.f.termsDelivery.value : "";
    salesQuotation001wb.supplierFrom = this.f.supplierFrom.value ? this.f.supplierFrom.value : "";
    salesQuotation001wb.hsn = this.f.hsn.value ? this.f.hsn.value : "";
    salesQuotation001wb.remarks = this.f.remarks.value ? this.f.remarks.value : null;
    salesQuotation001wb.statusSlno = this.f.statusSlno.value ? this.f.statusSlno.value : null;
    salesQuotation001wb.dueOn = new Date(this.f.dueOn.value);
    salesQuotation001wb.partitem001wbs = this.partItem?this.partItem:0;
    if (this.slNo) {
      salesQuotation001wb.slNo = this.slNo;
      salesQuotation001wb.unitslno = this.unitslno;
      salesQuotation001wb.insertUser = this.insertUser;
      salesQuotation001wb.insertDatetime = this.insertDatetime;
      salesQuotation001wb.updatedUser = this.authManager.getcurrentUser.username;
      salesQuotation001wb.updatedDatetime = new Date();
      this.salesQuotationManager.salesquotationupdate(salesQuotation001wb).subscribe((response) => {
        this.calloutService.showSuccess("Sales Quotation Updated Successfully");
        this.salesQuotationForm.reset();
        this.custemeradds=[];
        this.loadData();
        this.slNo = null;
        this.submitted = false;
      });
    } else {
      salesQuotation001wb.cDate = new Date();
      salesQuotation001wb.date = new Date();
      // salesinvoice001wb.dueOn = new Date();
      salesQuotation001wb.unitslno= this.user.unitslno;
      salesQuotation001wb.insertUser = this.authManager.getcurrentUser.username;
      salesQuotation001wb.insertDatetime = new Date();
      
      this.salesQuotationManager.salesquotationsave(salesQuotation001wb).subscribe((response) => {
        this.calloutService.showSuccess("Sales Quotation Saved Successfully");
        this.salesQuotationForm.reset();
        this.custemeradds=[];
        this.loadData();
        this.submitted = false;
      });
    }
  }

  onReset() {
    this.submitted = false;
    this.salesQuotationForm.reset();
  }

  onChange(event: any) {

    this.customerConsigneeManager.findOne(event.target.value).subscribe(response => {
      this.customerConsignee = deserialize<Customerconsignee001mb>(Customerconsignee001mb, response);
      this.consignees=[];

      for(let i=0;i<this.customerConsignees.length;i++){
        if(this.customerConsignees[i].companyName==this.customerConsignee.companyName){
          this.consignees.push(this.customerConsignees[i]);
        }
        
        
      }

      this.salesQuotationForm.patchValue({
        'custemerCode': this.customerConsignee.companyName,
        // 'consignee': this.customerConsignee.consignee,
      })
    });
    
  }
  



  onViewClick() {
    this.salesQuotationManager.salesquotationPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  onGeneratePdfReport() {
    this.salesQuotationManager.salesquotationPdf(this.user.unitslno).subscribe((response) => {
      let date= new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Sales-Quotation" + " " + newDate);
    })
  }


  onGenerateExcelReport() {
    this.salesQuotationManager.salesquotationExcel(this.user.unitslno).subscribe((response) => {
      let date= new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Sales-Quotation" + " " + newDate);
    })
  }

  onViewButtonClick(params: any) {
    this.salesQuotationManager.salesquotationParamsPdf(params.data.slNo,this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })

  }

  onPdfButtonClick(params: any) {
    this.salesQuotationManager.salesquotationParamsPdf(params.data.slNo,this.user.unitslno).subscribe((response) => {
      let date= new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, params.data.sInvoice + "  " + newDate);
    })

  }

  onEXcelButtonClick(params: any) {
    this.salesQuotationManager.salesquotationsingleExcel(params.data.slNo,this.user.unitslno).subscribe((response) => {      
      let date= new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, params.data.sInvoice + "  " + newDate);
    })

  }

  onStatusClick() {

    this.router.navigate(["/app-dash-board/app-approval/app-approval-request"]);
  }

}
