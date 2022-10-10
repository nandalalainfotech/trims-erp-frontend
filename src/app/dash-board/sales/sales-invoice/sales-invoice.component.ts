import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { saveAs } from 'file-saver';
import { deserialize } from 'serializer.ts/Serializer';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { CustemerAddComponent } from 'src/app/shared/custemer-add/custemer-add.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { CustmerRegManager } from 'src/app/shared/services/restcontroller/bizservice/CustemerRegistration.service';
import { CustomerConsigneeManager } from 'src/app/shared/services/restcontroller/bizservice/customer-consignee.service';
import { SalesInvoiceManager } from 'src/app/shared/services/restcontroller/bizservice/salesinvoice.service';
import { Custemer001wb } from 'src/app/shared/services/restcontroller/entities/Custemer001wb';
import { Custemerregistration001mb } from 'src/app/shared/services/restcontroller/entities/Custemerregistration001mb';
import { Customerconsignee001mb } from 'src/app/shared/services/restcontroller/entities/Customerconsignee001mb';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { Salesinvoice001wb } from 'src/app/shared/services/restcontroller/entities/Salesinvoice001wb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';

@Component({
  selector: 'app-sales-invoice',
  templateUrl: './sales-invoice.component.html',
  styleUrls: ['./sales-invoice.component.css']
})
export class SalesInvoiceComponent implements OnInit {


  frameworkComponents: any;
  public gridOptions: GridOptions | any;
  slaesInvocieForm: FormGroup | any;
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
  salesinvoice: Salesinvoice001wb[] = [];
  Custemerregs: Custemerregistration001mb[] = [];
  Custemerreg?:Custemerregistration001mb;
  Custemer001wbs: Custemer001wb[] = [];
  Custemer001wb?: Custemer001wb;
  customerConsignees: Customerconsignee001mb[] = [];
  customerConsignee?:Customerconsignee001mb;
  consignees: Customerconsignee001mb[] = [];
  customerconsignee001mbs: Customerconsignee001mb[] = [];

  custemeregs: any
  count: number = 0;
  custemeradds: Custemer001wb[] = [];
  user?: Login001mb | any;
  unitslno: number | any;
  partTAmount: any = [];
  salesPartItem: Custemer001wb[] = [];

  constructor(private formBuilder: FormBuilder,
    private authManager: AuthManager,
    private calloutService: CalloutService,
    private modalService: NgbModal,
    private datepipe: DatePipe,
    private salesInvoiceManager: SalesInvoiceManager,
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
    this.slaesInvocieForm = this.formBuilder.group({
      custemerCode: ['',],
      custmrSlno: ['',],
      sInvoice: ['',],
      cDate:  [this.datepipe.transform(new Date(), 'dd-MM-yyyy')],
      consignee: ['',],
      date: ['', Validators.required],
      otherRef: ['', Validators.required],
      pono: ['', Validators.required],
      refno: ['',],
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

    this.salesInvoiceManager.allsalesinvoice(this.user.unitslno).subscribe(response => {
      this.salesinvoice = deserialize<Salesinvoice001wb[]>(Salesinvoice001wb, response);
      
      if (this.salesinvoice.length > 0) {
        this.gridOptions?.api?.setRowData(this.salesinvoice);
      } else {
        this.gridOptions?.api?.setRowData([]);
      }
    });
    this.salesInvoiceManager.getCount().subscribe(response => {
      this.count = response[0].row == 0 ? 1 : parseInt(response[0].row) + 1;
      this.slaesInvocieForm.patchValue({
        pono: String("GST/2708/22-23/") + String(this.count).padStart(4, '0')
      });
    });
    this.salesInvoiceManager.getCount1().subscribe(response => {
      this.count = response[0].row == 0 ? 1 : parseInt(response[0].row) + 1;
      this.slaesInvocieForm.patchValue({
        sInvoice: String("ST/22-23/") + String(this.count).padStart(5, '0')
      });
    });
  }



  get f() { return this.slaesInvocieForm.controls }

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
        // field: "consignee",
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: this.setConsigneeNo.bind(this)
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
        headerName: 'Supplier From',
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
    return params.data.consignee ? this.customerConsignees.find(x => x.slNo == params.data.consignee)?.consignee:"";
    // return params.data.custmrSlno2 ? params.data.custmrSlno2.consignee : null;
    
  }

  onAuditButtonClick(params: any) {
    const modalRef = this.modalService.open(AuditComponent);
    modalRef.componentInstance.title = "Purchase Order";
    modalRef.componentInstance.details = params.data
  }

  onAddbuttonClick(object: any) {
    const modalRef = this.modalService.open(CustemerAddComponent, { windowClass: 'my-class' });
    modalRef.componentInstance.custemeradds = this.custemeradds;
    modalRef.result.then((data) => {
      if (data.status == 'Yes') {
        
        this.salesPartItem = data.salesPartItem;
        this.partTAmount = data.partTAmount
        
      }
    })
  }

  onEditButtonClick(params: any) {
    this.slNo = params.data.slNo;
    this.unitslno = params.data.unitslno;
    this.custemeradds = params.data.custemer001wbs;
    this.insertUser = params.data.insertUser;
    this.insertDatetime = params.data.insertDatetime;
    this.slaesInvocieForm.patchValue({
      'custmrSlno': params.data.custmrSlno,
      'sInvoice': params.data.sInvoice,
      'cDate': new Date(params.data.cDate),
      'custemerCode': params.data.custemerCode,
      'consignee': params.data.consignee,
      'pono': params.data.pono,
      'date': new Date(params.data.date),
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
        this.salesInvoiceManager.salesinvoicedelete(params.data.slNo).subscribe((response) => {
          for (let i = 0; i < this.salesinvoice.length; i++) {
            if (this.salesinvoice[i].slNo == params.data.slNo) {
              this.salesinvoice?.splice(i, 1);
              break;
            }
          }
          const selectedRows = params.api.getSelectedRows();
          params.api.applyTransaction({ remove: selectedRows });
          this.gridOptions.api.deselectAll();
          this.calloutService.showSuccess("Sales Invoices Removed Successfully");
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

  onPurchaseOrderClick(event: any, slaesInvocieForm: any) {
    this.markFormGroupTouched(this.slaesInvocieForm);
    this.submitted = true;
    if (this.slaesInvocieForm.invalid) {
      return;
    }

    let salesinvoice001wb = new Salesinvoice001wb();
    salesinvoice001wb.custmrSlno = this.f.custmrSlno.value ? this.f.custmrSlno.value : "";
    
    salesinvoice001wb.custemerCode = this.f.custemerCode.value ? this.f.custemerCode.value : "";
    salesinvoice001wb.sInvoice = this.f.sInvoice.value ? this.f.sInvoice.value : "";
    salesinvoice001wb.cDate = new Date(this.f.cDate.value);
    salesinvoice001wb.consignee = this.f.consignee.value ? this.f.consignee.value : "";
    salesinvoice001wb.date = new Date(this.f.date.value);
    salesinvoice001wb.pono = this.f.pono.value ? this.f.pono.value : "";
    salesinvoice001wb.refno = this.f.refno.value ? this.f.refno.value : "Na";
    salesinvoice001wb.otherRef = this.f.otherRef.value ? this.f.otherRef.value : "";
    salesinvoice001wb.dispatchThrough = this.f.dispatchThrough.value ? this.f.dispatchThrough.value : "";
    salesinvoice001wb.destination = this.f.destination.value ? this.f.destination.value : "";
    salesinvoice001wb.termsDelivery = this.f.termsDelivery.value ? this.f.termsDelivery.value : "";
    salesinvoice001wb.supplierFrom = this.f.supplierFrom.value ? this.f.supplierFrom.value : "";
    salesinvoice001wb.hsn = this.f.hsn.value ? this.f.hsn.value : "";
    salesinvoice001wb.remarks = this.f.remarks.value ? this.f.remarks.value : null;
    salesinvoice001wb.statusSlno = this.f.statusSlno.value ? this.f.statusSlno.value : null;
    salesinvoice001wb.dueOn = new Date(this.f.dueOn.value);
    salesinvoice001wb.custemer001wbs = this.salesPartItem?this.salesPartItem:0;
    if (this.slNo) {
      salesinvoice001wb.slNo = this.slNo;
      salesinvoice001wb.unitslno = this.unitslno;
      salesinvoice001wb.insertUser = this.insertUser;
      salesinvoice001wb.insertDatetime = this.insertDatetime;
      salesinvoice001wb.updatedUser = this.authManager.getcurrentUser.username;
      salesinvoice001wb.updatedDatetime = new Date();
      this.salesInvoiceManager.salesinvoiceupdate(salesinvoice001wb).subscribe((response) => {
        this.calloutService.showSuccess("Sales Invoices Updated Successfully");
        this.slaesInvocieForm.reset();
        this.custemeradds=[];
        this.loadData();
        this.slNo = null;
        this.submitted = false;
      });
    } else {
      // salesinvoice001wb.cDate = new Date();
      // salesinvoice001wb.date = new Date();
      // salesinvoice001wb.dueOn = new Date();
      salesinvoice001wb.unitslno= this.user.unitslno;
      salesinvoice001wb.insertUser = this.authManager.getcurrentUser.username;
      salesinvoice001wb.insertDatetime = new Date();
      
      this.salesInvoiceManager.salesinvoicesave(salesinvoice001wb).subscribe((response) => {
        this.calloutService.showSuccess("Sales Invoices Saved Successfully");
        this.slaesInvocieForm.reset();
        this.custemeradds=[];
        this.loadData();
        this.submitted = false;
      });
    }
  }

  onReset() {
    this.submitted = false;
    this.slaesInvocieForm.reset();
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

      this.slaesInvocieForm.patchValue({
        'custemerCode': this.customerConsignee.companyName,
        // 'consignee': this.customerConsignee.consignee,
      })
    });
    
  }
  



  onViewClick() {
    this.salesInvoiceManager.salesinvoicePdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  onGeneratePdfReport() {
    this.salesInvoiceManager.salesinvoicePdf(this.user.unitslno).subscribe((response) => {
      let date= new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Sales-Invoice" + " " + newDate);
    })
  }


  onGenerateExcelReport() {
    this.salesInvoiceManager.salesinvoiceExcel(this.user.unitslno).subscribe((response) => {
      let date= new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Sales-Invoice" + " " + newDate);
    })
  }

  onViewButtonClick(params: any) {
    this.salesInvoiceManager.salesinvoiceParamsPdf(params.data.slNo,this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })

  }
  onPdfButtonClick(params: any) {
    this.salesInvoiceManager.salesinvoiceParamsPdf(params.data.slNo,this.user.unitslno).subscribe((response) => {
      let date= new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, params.data.sInvoice + "  " + newDate);
    })

  }
  onEXcelButtonClick(params: any) {
    this.salesInvoiceManager.salesinvoicesingleExcel(params.data.slNo,this.user.unitslno).subscribe((response) => {      
      let date= new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, params.data.sInvoice + "  " + newDate);
    })

  }

  onStatusClick() {

    this.router.navigate(["/app-dash-board/app-approval/app-approval-request"]);
  }

}