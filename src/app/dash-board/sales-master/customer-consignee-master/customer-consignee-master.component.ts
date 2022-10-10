import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { deserialize } from 'serializer.ts/Serializer';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { CompanyDetailsManager } from 'src/app/shared/services/restcontroller/bizservice/Companydetails.service';
import { ConsigneeManager } from 'src/app/shared/services/restcontroller/bizservice/Consignee.service';
import { CustmerRegManager } from 'src/app/shared/services/restcontroller/bizservice/CustemerRegistration.service';
import { CustomerConsigneeManager } from 'src/app/shared/services/restcontroller/bizservice/customer-consignee.service';
import { SalesInvoiceManager } from 'src/app/shared/services/restcontroller/bizservice/salesinvoice.service';
import { Custemerregistration001mb } from 'src/app/shared/services/restcontroller/entities/Custemerregistration001mb';
import { Customerconsignee001mb } from 'src/app/shared/services/restcontroller/entities/Customerconsignee001mb';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';
import * as saveAs from 'file-saver';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-consignee-master',
  templateUrl: './customer-consignee-master.component.html',
  styleUrls: ['./customer-consignee-master.component.css']
})
export class CustomerConsigneeMasterComponent implements OnInit {

  frameworkComponents: any;
  public gridOptions: GridOptions | any;
  customerConsigneeForm: FormGroup | any;
  submitted = false;

  slNo: number | any;
  consigneeSlno: number | any;
  companyName:string = "";
  consignee: string = "";
  address1: string = "";
  address2: string = "";
  address3: string = "";
  gstIn: string = "";
  city: string = "";
  state: string = "";
  country: string = "";
  pinCode: number | any;
  emailId: string = "";
  contactNo: string = "";
  insertUser: string = "";
  insertDatetime: Date | any;
  updatedUser: string | null = "";
  updatedDatetime: Date | any;

  Custemerregs: Custemerregistration001mb[] = [];
  Custemerreg?:Custemerregistration001mb;
  customerConsignees: Customerconsignee001mb[] = [];

  count: number = 0;
  custemeradds: any;

  user?: Login001mb | any;
    unitslno: number | any;

  constructor(private formBuilder: FormBuilder,
    private authManager: AuthManager,
    private calloutService: CalloutService,
    private datepipe: DatePipe,
    private modalService: NgbModal,
    private custmerRegManager: CustmerRegManager,
    private customerConsigneeManager: CustomerConsigneeManager,) {
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent
    }
  }

  ngOnInit(): void {

    this.user = this.authManager.getcurrentUser;
    this.createDataGrid001();

    this.customerConsigneeForm = this.formBuilder.group({
      consigneeSlno: ['', Validators.required],
      companyName: ['', Validators.required],
      consignee: ['', Validators.required],
      address1: ['', Validators.required],
      address2: ['', Validators.required],
      address3: ['', Validators.required],
      // gstIn: ['', Validators.required],
      gstIn: ['', [Validators.required,
        Validators.minLength(11), Validators.maxLength(11)]],
		
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      // pinCode: ['', Validators.required],
      pinCode: ['', [Validators.required,Validators.pattern("^[0-9]*$"),Validators.minLength(6)]],
      contactNo:['',  [Validators.required, Validators.pattern("^[0-9]*$"),Validators.minLength(10)]],
      // emailId: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    //   contactNo: ['', [Validators.required]
    //  ],
    })

    this.custmerRegManager.allCustmerreg(this.user.unitslno).subscribe(response => {
      this.Custemerregs = deserialize<Custemerregistration001mb[]>(Custemerregistration001mb, response);
    });

    this.loadData();
  }

  loadData(){
    this.customerConsigneeManager.allCustomerConsignee(this.user.unitslno).subscribe(response => {
      this.customerConsignees = deserialize<Customerconsignee001mb[]>(Customerconsignee001mb, response);
      if (this.customerConsignees.length > 0) {
        this.gridOptions?.api?.setRowData(this.customerConsignees);
      } else {
        this.gridOptions?.api?.setRowData([]);
      }
    });
    
  }

  get f() { return this.customerConsigneeForm.controls }


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
       
        headerName: 'Customer code',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: this.setCustomerCode.bind(this)
      },
      {
        headerName: 'Company Name',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: this.setCompanyName.bind(this)
      },
      {
        headerName: 'Consignee No',
        field: 'consignee',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Address 1',
        field: 'address1',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Address 2',
        field: "address2",
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Address 3',
        field: 'address3',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'GST IN',
        field: 'gstIn',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'City',
        field: 'city',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'State',
        field: 'state',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Country',
        field: 'country',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Pin Code',
        field: 'pinCode',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Email Id',
        field: "emailId",
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Contact No',
        field: "contactNo",
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


  setCustomerCode(params: any): string {
    return params.data.consigneeSlno2 ? params.data.consigneeSlno2.custemercode : null;
  }
  setCompanyName(params: any): string {
    return params.data.consigneeSlno2 ? params.data.consigneeSlno2.custemername : null;
  }

  onAuditButtonClick(params: any) {
    const modalRef = this.modalService.open(AuditComponent);
    modalRef.componentInstance.title = "Customer Consignee";
    modalRef.componentInstance.details = params.data
  }

  onEditButtonClick(params: any) {
    this.slNo = params.data.slNo;
    this.unitslno = params.data.unitslno;
    this.insertUser = params.data.insertUser;
    this.insertDatetime = params.data.insertDatetime;
    this.customerConsigneeForm.patchValue({
      'consigneeSlno': params.data.consigneeSlno,
      'companyName': params.data.companyName,
      'consignee': params.data.consignee,
      'address1': params.data.address1,
      'address2': params.data.address2,
      'address3': params.data.address3,
      'gstIn': params.data.gstIn,
      'city': params.data.city,
      'state': params.data.state,
      'country': params.data.country,
      'pinCode': params.data.pinCode,
      'emailId': params.data.emailId,
      'contactNo': params.data.contactNo,
    });
  }

  onDeleteButtonClick(params: any) {
    const modalRef = this.modalService.open(ConformationComponent);
    modalRef.componentInstance.details = "Customer Consignee";
    modalRef.result.then((data) => {
      if (data == "Yes") {
        this.customerConsigneeForm.customerConsigneeDelete(params.data.slNo).subscribe((response) => {
          // for (let i = 0; i < this.consignees.length; i++) {
          //   if (this.consignees[i].slNo == params.data.slNo) {
          //     this.consignees?.splice(i, 1);
          //     break;
          //   }
          // }
          const selectedRows = params.api.getSelectedRows();
          params.api.applyTransaction({ remove: selectedRows });
          this.gridOptions.api.deselectAll();
          this.calloutService.showSuccess("Customer Consignee Removed Successfully");
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
  oncustomerConsigneeClick(event: any, customerConsigneeForm: any) {
    this.markFormGroupTouched(this.customerConsigneeForm);
    this.submitted = true;
    if (this.customerConsigneeForm.invalid) {
      return;
    }

    let customerconsignee001mb = new Customerconsignee001mb();
    customerconsignee001mb.consigneeSlno = this.f.consigneeSlno.value ? this.f.consigneeSlno.value : "";
    customerconsignee001mb.companyName = this.f.companyName.value ? this.f.companyName.value : "";
    customerconsignee001mb.consignee = this.f.consignee.value ? this.f.consignee.value : "";
    customerconsignee001mb.address1 = this.f.address1.value ? this.f.address1.value : "";
    customerconsignee001mb.address2 = this.f.address2.value ? this.f.address2.value : "";
    customerconsignee001mb.address3 = this.f.address3.value ? this.f.address3.value : "";
    customerconsignee001mb.gstIn = this.f.gstIn.value ? this.f.gstIn.value : "";
    customerconsignee001mb.city = this.f.city.value ? this.f.city.value : "";
    customerconsignee001mb.state = this.f.state.value ? this.f.state.value : "";
    customerconsignee001mb.country = this.f.country.value ? this.f.country.value : "";
    customerconsignee001mb.pinCode = this.f.pinCode.value ? this.f.pinCode.value : "";
    customerconsignee001mb.emailId = this.f.emailId.value ? this.f.emailId.value : "";
    customerconsignee001mb.contactNo = this.f.contactNo.value ? this.f.contactNo.value : "";
    if (this.slNo) {
      customerconsignee001mb.slNo = this.slNo;
      customerconsignee001mb.unitslno = this.unitslno;
      customerconsignee001mb.insertUser = this.insertUser;
      customerconsignee001mb.insertDatetime = this.insertDatetime;
      customerconsignee001mb.updatedUser = this.authManager.getcurrentUser.username;
      customerconsignee001mb.updatedDatetime = new Date();
      this.customerConsigneeManager.customerConsigneeUpdate(customerconsignee001mb).subscribe((response) => {
        this.calloutService.showSuccess("Customer Consignee Updated Successfully");
        this.customerConsigneeForm.reset();
        this.loadData();
        this.slNo = null;
        this.submitted = false;
      });
    } else {
      customerconsignee001mb.unitslno= this.user.unitslno;
      customerconsignee001mb.insertUser = this.authManager.getcurrentUser.username;
      customerconsignee001mb.insertDatetime = new Date();
      this.customerConsigneeManager.customerConsigneeSave(customerconsignee001mb).subscribe((response) => {
        this.calloutService.showSuccess("Customer Consignee Saved Successfully");
        this.customerConsigneeForm.reset();
        this.loadData();
        this.submitted = false;
      });
    }
  }

  onChange(event: any) {

    this.custmerRegManager.findOne(event.target.value).subscribe(response => {
      this.Custemerreg = deserialize<Custemerregistration001mb>(Custemerregistration001mb, response);
      
      this.customerConsigneeForm.patchValue({
        'companyName': this.Custemerreg.custemername,
      })
    });
    
  }


  onReset() {
    this.submitted = false;
    this.customerConsigneeForm.reset();
  }

  
  onViewClick() {
    this.customerConsigneeManager.custconsigneePdf(this.user.unitslno).subscribe((response) => {
        var blob = new Blob([response], { type: 'application/pdf' });
        var blobURL = URL.createObjectURL(blob);
        window.open(blobURL);
    })
}

onGeneratePdfReport() {
    this.customerConsigneeManager.custconsigneePdf(this.user.unitslno).subscribe((response) => {      
        let date = new Date();
        let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
        saveAs(response, "Customer-Consignee-Details" + " " + newDate);
    })
}

onGenerateExcelReport() {
    this.customerConsigneeManager.custconsigneeExcel(this.user.unitslno).subscribe((response) => {      
        let date = new Date();
        let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
        saveAs(response, "Customer-Consignee-Details" + " " + newDate);
    });
}

}
