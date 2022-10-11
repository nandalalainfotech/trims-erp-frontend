import { DatePipe } from '@angular/common';
import * as saveAs from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { deserialize } from 'serializer.ts/Serializer';
import { AddCustomerContactComponent } from 'src/app/shared/add-customer-contact/add-customer-contact.component';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { CustomerPoComponent } from 'src/app/shared/customer-po/customer-po.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { CustmerRegManager } from 'src/app/shared/services/restcontroller/bizservice/CustemerRegistration.service';
import { CustomerPoMasterManager } from 'src/app/shared/services/restcontroller/bizservice/customerPoMaster.service';
import { Custemerregistration001mb } from 'src/app/shared/services/restcontroller/entities/Custemerregistration001mb';
import { CustomerPoMaster001mb } from 'src/app/shared/services/restcontroller/entities/customerPo001mb';
import { CustomerPoItem001wb } from 'src/app/shared/services/restcontroller/entities/customerPoItem001wb';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';


@Component({
  selector: 'app-customer-po-master',
  templateUrl: './customer-po-master.component.html',
  styleUrls: ['./customer-po-master.component.css']
})
export class CustomerPoMasterComponent implements OnInit {
  customerPOForm: FormGroup | any;
  frameworkComponents: any;
  submitted = false;
  public gridOptions: GridOptions | any;
  slNo?: number | any;
  custemercode: number | any;
  custemername: string = "";
  custemerPONo: string = "";
  poDate?: Date | null;
  deliveryDate?: Date | null;
  packing: string = "";
  logistic: string = "";
  inspection: string = "";
  insertUser: string = "";
  insertDatetime?: Date;
  updatedUser: string = "";
  updatedDatetime?: Date | null;

  user?: Login001mb | any;
  unitslno: number | any;
  custmerRegs: Custemerregistration001mb[] = [];
  custemerregistration001mb?: Custemerregistration001mb;
  customerPoMasters: CustomerPoMaster001mb[] = [];
  purchasereqitem: CustomerPoItem001wb[] = [];
  customerPoItem: CustomerPoItem001wb[] = [];
  partTAmount: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private calloutService: CalloutService,
    private authManager: AuthManager,
    private modalService: NgbModal,
    private custmerRegManager: CustmerRegManager,
    private customerPoMasterManager: CustomerPoMasterManager,
    private datepipe: DatePipe,
    private http: HttpClient) {
    this.frameworkComponents = {
        iconRenderer: IconRendererComponent
    }

}

  ngOnInit(): void {
    this.user = this.authManager.getcurrentUser;
    this.createDataGrid001();
    this.customerPOForm = this.formBuilder.group({
      custemercode: ['', Validators.required],
      custemername: [''],
      custemerPONo: ['', Validators.required],
      poDate: ['', Validators.required],
      deliveryDate: ['', Validators.required],
      packing: ['', Validators.required],
      logistic: ['', Validators.required],
      inspection: ['', Validators.required],

    });
    this.custmerRegManager.allCustmerreg(this.user.unitslno).subscribe(response => {
      this.custmerRegs = deserialize<Custemerregistration001mb[]>(Custemerregistration001mb, response);

    });
    this.loadData();

  }
  loadData() {

    this.customerPoMasterManager.allCustomerPo(this.user.unitslno).subscribe(response => {
      this.customerPoMasters = deserialize<CustomerPoMaster001mb[]>(CustomerPoMaster001mb, response);
      if (this.customerPoMasters.length > 0) {
        this.gridOptions?.api?.setRowData(this.customerPoMasters);
      } else {
        this.gridOptions?.api?.setRowData([]);
      }
    });

  }
  get f() { return this.customerPOForm.controls }

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
        headerName: 'Customer Code',
        // field: 'custemercode',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: this.setCustomerCode.bind(this)
      },
      {
        headerName: 'Customer Name',
        field: 'custemername',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        // valueGetter: this.setMachineCode.bind(this)
      },

      {
        headerName: 'Customer PONo',
        field: 'custemerPONo',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        // valueGetter: this.setMachineName.bind(this)
      },
      {
        headerName: 'PO Date',
        // field: 'poDate',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: (params: any) => {
          return params.data.poDate ? this.datepipe.transform(params.data.poDate, 'dd-MM-yyyy') : '';
        }
      },
      {
        headerName: 'Delivery Date',
        // field: 'deliveryDate',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: (params: any) => {
          return params.data.deliveryDate ? this.datepipe.transform(params.data.deliveryDate, 'dd-MM-yyyy') : '';
        }
      },

      {
        headerName: 'Packing',
        field: 'packing',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true
      },
      {
        headerName: 'Logistics',
        field: 'logistic',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true
      },
      {
        headerName: 'Inspection',
        field: 'inspection',
        // field: 'date',
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
  setCustomerCode(params: any): string {
    return params.data.custemercode ? this.custmerRegs.find(x => x.slNo === params.data.custemercode)?.custemercode : null;
  }
  onEditButtonClick(params: any) {

    this.slNo = params.data.slNo;
    this.unitslno = params.data.unitslno;
    this.purchasereqitem = params.data.customerpoitem001wbs;
    this.insertUser = params.data.insertUser;
    this.insertDatetime = params.data.insertDatetime;
    this.customerPOForm.patchValue({

      'custemercode': params.data.custemercode,
      'custemername': params.data.custemername,
      'custemerPONo': params.data.custemerPONo,
      'poDate': new Date(params.data.poDate),
      'deliveryDate': new Date(params.data.deliveryDate),
      'packing': params.data.packing,
      'logistic': params.data.logistic,
      'inspection': params.data.inspection,
    });
  }

  onAddbuttonClick() {
    const modalRef = this.modalService.open(CustomerPoComponent, { windowClass: 'my-class' });
    modalRef.componentInstance.purchasereqitem = this.purchasereqitem;


    modalRef.result.then((data) => {
      if (data.status == 'Yes') {

        this.customerPoItem = data.customerPoItem;
        this.partTAmount = data.partTAmount

      }
    })

  }

  onDeleteButtonClick(params: any) {
    const modalRef = this.modalService.open(ConformationComponent);
    modalRef.componentInstance.details = "Customer PO Form";
    modalRef.result.then((data) => {
      if (data == "Yes") {
        this.customerPOForm.CustomerPoDelete(params.data.slNo).subscribe((response) => {
          for (let i = 0; i < this.customerPoMasters.length; i++) {
            if (this.customerPoMasters[i].slNo == params.data.slNo) {
              this.customerPoMasters?.splice(i, 1);
              break;
            }
          }
          const selectedRows = params.api.getSelectedRows();
          params.api.applyTransaction({ remove: selectedRows });
          this.gridOptions.api.deselectAll();
          this.calloutService.showSuccess("Customer PO Details Removed Successfully");
        });
      }
    })
  }

  onAuditButtonClick(params: any) {
    const modalRef = this.modalService.open(AuditComponent);
    modalRef.componentInstance.title = "Customer PO Form";
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

  onCustomerPOClick(event: any, customerPOForm: any) {

    this.markFormGroupTouched(this.customerPOForm);
    this.submitted = true;
    if (this.customerPOForm.invalid) {
      return;
    }
    let customerPoMaster001mb = new CustomerPoMaster001mb();
    customerPoMaster001mb.custemercode = this.f.custemercode.value ? this.f.custemercode.value : "";
    customerPoMaster001mb.custemername = this.f.custemername.value ? this.f.custemername.value : "";
    customerPoMaster001mb.custemerPONo = this.f.custemerPONo.value ? this.f.custemerPONo.value : "";
    customerPoMaster001mb.poDate = new Date(this.f.poDate.value);
    customerPoMaster001mb.deliveryDate = new Date(this.f.deliveryDate.value);
    customerPoMaster001mb.packing = this.f.packing.value ? this.f.packing.value : "";
    customerPoMaster001mb.logistic = this.f.logistic.value ? this.f.logistic.value : "";
    customerPoMaster001mb.inspection = this.f.inspection.value ? this.f.inspection.value : "";
    customerPoMaster001mb.customerpoitem001wbs = this.customerPoItem ? this.customerPoItem : 0;
    if (this.slNo) {
      customerPoMaster001mb.slNo = this.slNo;
      customerPoMaster001mb.unitslno = this.unitslno;
      customerPoMaster001mb.insertUser = this.insertUser;
      customerPoMaster001mb.insertDatetime = this.insertDatetime;
      customerPoMaster001mb.updatedUser = this.authManager.getcurrentUser.username;
      customerPoMaster001mb.updatedDatetime = new Date();

      this.customerPoMasterManager.CustomerPoUpdate(customerPoMaster001mb).subscribe((response) => {
        this.calloutService.showSuccess("Customer PO Updated Successfully");
        this.customerPOForm.reset();
        this.loadData();
        this.slNo = null;
        this.submitted = false;
      });
    }
    else {
      // customerPoMaster001mb.poDate = new Date(this.f.poDate.value);
      // customerPoMaster001mb.deliveryDate = new Date(this.f.deliveryDate.value);
      customerPoMaster001mb.unitslno = this.user.unitslno;
      customerPoMaster001mb.insertUser = this.authManager.getcurrentUser.username;
      customerPoMaster001mb.insertDatetime = new Date();
      this.customerPoMasterManager.CustomerPoSave(customerPoMaster001mb).subscribe((response) => {
        this.calloutService.showSuccess("Customer PO Saved Successfully");
        this.loadData();
        this.customerPOForm.reset();
        this.submitted = false;
      });
    }

  }

  onReset() {
    this.submitted = false;
    this.customerPOForm.controls.custemercode.reset();
    this.customerPOForm.controls.custemername.reset();
    this.customerPOForm.controls.custemerPONo.reset();
    this.customerPOForm.controls.poDate.reset();
    this.customerPOForm.controls.deliveryDate.reset();
    this.customerPOForm.controls.packing.reset();
    this.customerPOForm.controls.logistic.reset();
    this.customerPOForm.controls.inspection.reset();
  }

  onChangePO(event: any) {
    this.custmerRegManager.findOne(event.target.value).subscribe(response => {
      this.custemerregistration001mb = deserialize<Custemerregistration001mb>(Custemerregistration001mb, response);

      this.customerPOForm.patchValue({
        'custemername': this.custemerregistration001mb.custemername,
      });
    });
  }

  onViewButtonClick(params: any) {
    this.customerPoMasterManager.pdfId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })

  }

  onPdfButtonClick(params: any) {
    this.customerPoMasterManager.pdfId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, this.custmerRegs.find(x => x.slNo === params.data.custemercode)?.custemercode + " " + newDate);
    })

  }
  onEXcelButtonClick(params: any) {
    this.customerPoMasterManager.ExcelId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, this.custmerRegs.find(x => x.slNo === params.data.custemercode)?.custemercode + " " +  newDate);
    })

  }

  onViewClick() {
    this.customerPoMasterManager.customerPomasterPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  onGeneratePdfReport() {
    this.customerPoMasterManager.customerPomasterPdf(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Customer-Po-Details" + " " + newDate);
    })
  }

  onGenerateExcelReport() {
    this.customerPoMasterManager.customerPomasterExcel(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Customer-Po-Details" + " " + newDate);
    });
  }


}
