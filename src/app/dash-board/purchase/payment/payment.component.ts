import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { deserialize } from 'serializer.ts/Serializer';
import { saveAs } from 'file-saver';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { PaymentManager } from 'src/app/shared/services/restcontroller/bizservice/Payment.service';
import { PurchaseorderManager } from 'src/app/shared/services/restcontroller/bizservice/Purchaseorder.service';
import { SalesOrderManager } from 'src/app/shared/services/restcontroller/bizservice/Salesorder.service';
import { Payment001wb } from 'src/app/shared/services/restcontroller/entities/Payment001wb';
import { Purchaseorder001wb } from 'src/app/shared/services/restcontroller/entities/Purchaseorder001wb';
import { Salesorder001wb } from 'src/app/shared/services/restcontroller/entities/Salesorder001wb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  frameworkComponents: any;
  public gridOptions: GridOptions | any;
  paymentForm: FormGroup | any;
  submitted = false;
  slNo: number | any;
  date: Date | any;
  tAmount: number | any;
  paidAmount: number | any;
  outAmount: number | any;
  modeofPay: string = "";
  chequeNo: string = "";
  payIdno: string = "";
  status: string = "";
  dueDate: Date | any;

  insertUser: string = "";
  insertDatetime: Date | any;
  updatedUser: string | null = "";
  updatedDatetime: Date | any;
  minDate = new Date();
  maxDate = new Date();
  sales: Salesorder001wb[] = [];
  payment: Payment001wb[] = [];
  orders: Purchaseorder001wb[] = [];
  user?: Login001mb | any;
  unitslno: number | any;


  amount: number | any;

  constructor(private formBuilder: FormBuilder,
    private authManager: AuthManager,
    private calloutService: CalloutService,
    private modalService: NgbModal,
    private datepipe: DatePipe,
    private salesOrderManager: SalesOrderManager,
    private paymentManager: PaymentManager,
    private purchaseorderManager: PurchaseorderManager) {
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent
    }
  }

  ngOnInit(): void {
    this.user = this.authManager.getcurrentUser;

    this.maxDate.setFullYear(this.maxDate.getFullYear() + 10);

    this.createDataGrid001();

    this.loadData();

    this.paymentForm = this.formBuilder.group({
      date: [this.datepipe.transform(new Date(), 'dd-MM-yyyy')],
      tAmount: ['',],
      paidAmount: ['', Validators.required],
      outAmount: ['', Validators.required],
      modeofPay: ['', Validators.required],
      chequeNo: ['', Validators.required],
      payIdno: ['', Validators.required],
      status: ['', Validators.required],
      dueDate: ['',],

      amount: [''],
    })

    this.salesOrderManager.allsale(this.user.unitslno).subscribe(response => {
      this.sales = deserialize<Salesorder001wb[]>(Salesorder001wb, response);
    });

    this.purchaseorderManager.allpurchaseorder(this.user.unitslno).subscribe(response => {
      this.orders = deserialize<Purchaseorder001wb[]>(Purchaseorder001wb, response);
    });

  }

  loadData() {
    this.paymentManager.allpayment(this.user.unitslno).subscribe(response => {
      this.payment = deserialize<Payment001wb[]>(Payment001wb, response);
      if (this.payment.length > 0) {
        this.gridOptions?.api?.setRowData(this.payment);
      } else {
        this.gridOptions?.api?.setRowData([]);
      }
    });
  }

  get f() { return this.paymentForm.controls }

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
        headerName: 'Sl No',
        field: 'slNo',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Payment Date',
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
        headerName: 'Total Amount',
        field: 'tAmount',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Paid Amount',
        field: 'paidAmount',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        
      },
      {
        headerName: 'Outstanding Amount',
        field: 'outAmount',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Mode of Pay',
        field: 'modeofPay',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
       
      },
      {
        headerName: 'Cheque No',
        field: 'chequeNo',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Payment Reference ID No',
        field: 'payIdno',
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
        headerName: 'Next Due Date',
        // field: 'dueDate',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: (params: any) => {
          return params.data.dueDate ? this.datepipe.transform(params.data.dueDate, 'dd-MM-yyyy') : '';
        }
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

  rowClicked(params: any) {
    params.node.setData({
      ...params.data,
      name: true,
    });
  }

  getRowStyle(params) {
    console.log("params",params);
    
    if (params.data.status == 'Paid') {
      return { 'background-color': '#ff0080' };
    } else if (params.data.status == 'Partially Paid') {
      return { 'background-color': '#0080ff' };
    } 
    return;
  }

 

  onAuditButtonClick(params: any) {
    const modalRef = this.modalService.open(AuditComponent);
    modalRef.componentInstance.title = "Payment";
    modalRef.componentInstance.details = params.data
  }

  onEditButtonClick(params: any) {
    this.slNo = params.data.slNo;
    this.unitslno = params.data.unitslno;
    this.insertUser = params.data.insertUser;
    this.insertDatetime = params.data.insertDatetime;
    this.paymentForm.patchValue({
      'date': new Date(params.data.tAmount),
      'tAmount': params.data.date,
      'paidAmount': params.data.paidAmount,
      'outAmount': params.data.outAmount,
      'modeofPay': params.data.modeofPay,
      'chequeNo': params.data.chequeNo,
      'payIdno': params.data.payIdno,
      'status': params.data.status,
      'dueDate': new Date(params.data.dueDate),
    });
  }

  onDeleteButtonClick(params: any) {
    const modalRef = this.modalService.open(ConformationComponent);
    modalRef.componentInstance.details = "Payment";
    modalRef.result.then((data) => {
      if (data == "Yes") {
        this.paymentManager.paymentDelete(params.data.slNo).subscribe((response) => {
          for (let i = 0; i < this.payment.length; i++) {
            if (this.payment[i].slNo == params.data.slNo) {
              this.payment?.splice(i, 1);
              break;
            }
          }
          const selectedRows = params.api.getSelectedRows();
          params.api.applyTransaction({ remove: selectedRows });
          this.gridOptions.api.deselectAll();
          this.calloutService.showSuccess("Payment Removed Successfully");
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

  onpaymentClick(event: any, paymentForm: any) {
    console.log("paymentForm--->", paymentForm);
    
    this.markFormGroupTouched(this.paymentForm);
    this.submitted = true;
    if (this.paymentForm.invalid) {
      return;
    }

    let payment001wb = new Payment001wb();
    payment001wb.date = new Date(this.f.date.value);
    payment001wb.tAmount = this.f.tAmount.value ? this.f.tAmount.value : "";
    payment001wb.paidAmount = this.f.paidAmount.value ? this.f.paidAmount.value : "";
    payment001wb.outAmount =  this.f.outAmount.value ? this.f.outAmount.value : "";
    payment001wb.modeofPay = this.f.modeofPay.value ? this.f.modeofPay.value : "";
    payment001wb.chequeNo = this.f.chequeNo.value ? this.f.chequeNo.value : "";
    payment001wb.payIdno = this.f.payIdno.value ? this.f.payIdno.value : "";
    payment001wb.status = this.f.status.value ? this.f.status.value : "";
    payment001wb.dueDate = new Date(this.f.dueDate.value);
    if (this.slNo) {
      payment001wb.slNo = this.slNo;
      payment001wb.unitslno = this.unitslno;
      payment001wb.insertUser = this.insertUser;
      payment001wb.insertDatetime = this.insertDatetime;
      payment001wb.updatedUser = this.authManager.getcurrentUser.username;
      payment001wb.updatedDatetime = new Date();
      this.paymentManager.paymentUpdate(payment001wb).subscribe((response) => {
        this.calloutService.showSuccess("Payment Updated Successfully");
        this.paymentForm.reset();
        this.loadData();
        this.paymentForm.patchValue(
          { date: this.datepipe.transform(new Date(), 'dd-MM-yyyy') }
        );
        this.slNo = null;
        this.submitted = false;
      });
    } else {
      payment001wb.date = new Date();
      payment001wb.unitslno= this.user.unitslno;
      payment001wb.insertUser = this.authManager.getcurrentUser.username;
      payment001wb.insertDatetime = new Date();
      this.paymentManager.paymentSave(payment001wb).subscribe((response) => {
        this.calloutService.showSuccess("Payment Saved Successfully");
        this.paymentForm.reset();
        this.paymentForm.patchValue(
          { date: this.datepipe.transform(new Date(), 'dd-MM-yyyy') }
        );
        this.loadData();
        this.submitted = false;
      });
    }
  }

  onReset() {
    this.submitted = false;
    this.paymentForm.reset();
  }

  onPayClick() {
   
  }


 

  onViewClick() {
    this.paymentManager.paymentPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  onGeneratePdfReport() {
    this.paymentManager.paymentPdf(this.user.unitslno).subscribe((response) => {
      let date= new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Payment-Details" + " " + newDate);
    })
  }

  onGenerateExcelReport() {
    this.paymentManager.paymentExcel(this.user.unitslno).subscribe((response) => {
      let date= new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Payment-Details" + " " + newDate);
    })
  }

}