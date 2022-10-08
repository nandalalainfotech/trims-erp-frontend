import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { saveAs } from 'file-saver';
import { deserialize } from 'serializer.ts/Serializer';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { OrderAddItemComponent } from 'src/app/shared/order-add-item/order-add-item.component';
import { PurchaseItemsComponent } from 'src/app/shared/purchase-items/purchase-items.component';
import { PurchseSlipComponent } from 'src/app/shared/purchse-slip/purchse-slip.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { PurchasereqItemManager } from 'src/app/shared/services/restcontroller/bizservice/Purchasereqitem.service';
import { PurchasereqslipManager } from 'src/app/shared/services/restcontroller/bizservice/Purchasereqslip.service';
import { SparesettingManager } from 'src/app/shared/services/restcontroller/bizservice/sparesetting.service';
import { SupplierTypeManager } from 'src/app/shared/services/restcontroller/bizservice/Suppliertype.service';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { Purchasereqitem001wb } from 'src/app/shared/services/restcontroller/entities/purchasereqitems001wb';
import { Purchasereqslip001wb } from 'src/app/shared/services/restcontroller/entities/Purchasereqslip001wb';
import { Spares001mb } from 'src/app/shared/services/restcontroller/entities/spares001mb';
import { Suppliertype001mb } from 'src/app/shared/services/restcontroller/entities/Suppliertype001mb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';

@Component({
  selector: 'app-purchase-req-slip',
  templateUrl: './purchase-req-slip.component.html',
  styleUrls: ['./purchase-req-slip.component.css']
})
export class PurchaseReqSlipComponent implements OnInit {

  @Input() id: any;

  frameworkComponents: any;
  public gridOptions: GridOptions | any;
  purchasereqForm: FormGroup | any;
  submitted = false;
  slNo: number | any;
  date: Date | any;
  prsNo: string | any;
  poDate: Date | any;
  reqDate: Date | any;
  poNo: string | any;
  remarks: string = "";
  suppliertype: string = "";
  status: string = "";
  getCount: any;
  insertUser: string = "";
  insertDatetime: Date | any;
  updatedUser: string | null = "";
  updatedDatetime: Date | any;
  minDate = new Date();
  maxDate = new Date();
  sparesSettings: Spares001mb[] = [];
  spares001mb?: Spares001mb;
  purchaseRegs: Purchasereqslip001wb[] = [];
  addPopup: any;
  count: number = 0;
  purchasereqitem: Purchasereqitem001wb[] = [];
  suppliertype001mbs: Suppliertype001mb[] = [];
  suppliertype001mb?: Suppliertype001mb;
  purchasereqitem001wbs: Purchasereqitem001wb[] = [];
  purchasereqitem001wb?: Purchasereqitem001wb;
  approvel?: Purchasereqitem001wb | any;
  sslno2: Suppliertype001mb[] | any;
  suppliertypeItems: any = [];
  user?: Login001mb | any;
  unitslno: number | any;
  purchaseTotalAmount: Purchasereqitem001wb[] = [];
  TAmount: any = [];
  consumableTAmount: any = [];
  childparTAmount: any = [];
  partTAmount: any = [];
  qunty:any;
  itemcode:any;
  itemname:any;
  descrip:any;

  constructor(
    private formBuilder: FormBuilder,
    private sparesettingManager: SparesettingManager,
    private authManager: AuthManager,
    private calloutService: CalloutService,
    private supplierTypeManager: SupplierTypeManager,
    private modalService: NgbModal,
    private datepipe: DatePipe,
    private purchaseregslipManager: PurchasereqslipManager,
    private purchasereqItemManager: PurchasereqItemManager,
    private router: ActivatedRoute,
    ) {
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent
    }
  }

  ngOnInit(): void {
    this.user = this.authManager.getcurrentUser;
    this.router.queryParams.subscribe((params: { [x: string]: any; }) => {
      this.qunty = params["qunty"];
      this.itemcode = params["itemcode"];
      this.itemname = params["itemname"];
      this.descrip = params["descrip"];
      console.log("qunty",this.poNo);
      
    });
     setTimeout(() => {
        this.purchasereqForm.patchValue({
          qunty:this.qunty,
          itemcode:this.itemcode,
          itemname:this.itemname,
          descrip:this.descrip,
         }, 10);
      });
    // this.router.paramMap.subscribe((params: ParamMap) => {
    //   this.poNo = params.get('qunty');
    //   console.log("this.poNo",this.poNo);
      
    // });

    this.maxDate.setFullYear(this.maxDate.getFullYear() + 10);

    this.createDataGrid001();

    this.loadData();



    this.purchasereqForm = this.formBuilder.group({
      date: [this.datepipe.transform(new Date(), 'dd-MM-yyyy')],
      prsNo: ['',],
      poDate: ['', Validators.required],
      reqDate: ['', Validators.required],
      poNo: ['', Validators.required],
      remarks: ['', Validators.required],
      suppliertype: ['', Validators.required],
      qunty: ['',],
      itemcode: ['',],
      itemname: ['',],
      descrip: ['',],
    })

    this.sparesettingManager.allsparesetting(this.user.unitslno).subscribe(response => {
      this.sparesSettings = deserialize<Spares001mb[]>(Spares001mb, response);
    });

    this.supplierTypeManager.allsuppliertype(this.user.unitslno).subscribe(response => {
      this.suppliertype001mbs = deserialize<Suppliertype001mb[]>(Suppliertype001mb, response);

      for (let i = 0; i < this.suppliertype001mbs.length; i++) {
        if (this.suppliertype001mbs[i].sslno == 8) {
          this.suppliertypeItems.push(this.suppliertype001mbs[i])
        }
      }

    });

    this.purchasereqItemManager.allpurchasereqItem(this.user.unitslno).subscribe(response => {
      this.purchasereqitem001wbs = deserialize<Purchasereqitem001wb[]>(Purchasereqitem001wb, response);

    });

  }



  loadData() {
    this.purchaseregslipManager.allpurchaseslip(this.user.unitslno).subscribe(response => {
      this.purchaseRegs = deserialize<Purchasereqslip001wb[]>(Purchasereqslip001wb, response);
      if (this.purchaseRegs.length > 0) {
        this.gridOptions?.api?.setRowData(this.purchaseRegs);
      } else {
        this.gridOptions?.api?.setRowData([]);
      }
    });

    this.purchaseregslipManager.getCount().subscribe(response => {
      this.count = response[0].row == 0 ? 1 : parseInt(response[0].row) + 1;
      this.purchasereqForm.patchValue({
        prsNo: String("SE/PRS/22-23/") + String(this.count).padStart(4, '0')
      });
    });

  }

  get f() { return this.purchasereqForm.controls }

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
        headerName: 'PRS No',
        field: 'prsNo',
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
          return params.data.date ? this.datepipe.transform(params.data.date, 'dd-MM-yyyy') : '';
        }
      },
      {
        headerName: 'Our P.O.No',
        field: 'poNo',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'P.O Date',
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
        headerName: 'Requried Date',
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
    }else if (params.data.status == 'Request For Approval'){
      return { 'background-color': '#FFA500' };
    }else if (params.data.status == 'Waiting For Request'){
      return { 'background-color': '#FF69B4' };
    }
    return;
  }

  setSpares(params: any): string {
    return params.data.sparenameSlno2 ? params.data.sparenameSlno2.spares : null;
  }

  onAuditButtonClick(params: any) {
    const modalRef = this.modalService.open(AuditComponent);
    modalRef.componentInstance.title = "Purchase Requisition Slip";
    modalRef.componentInstance.details = params.data
  }

  onEditButtonClick(params: any) {
    
    if(params.data.status != 'Approved'){
    this.slNo = params.data.slNo;
    this.unitslno = params.data.unitslno;
    this.purchasereqitem = params.data.purchasereqitem001wbs;
    this.insertUser = params.data.insertUser;
    this.insertDatetime = params.data.insertDatetime;
    this.purchasereqForm.patchValue({
      'date': params.data.date,
      'poDate': new Date(params.data.poDate),
      'reqDate': new Date(params.data.reqDate),
      'prsNo': params.data.prsNo,
      'poNo': params.data.poNo,
      'remarks': params.data.remarks,
      'suppliertype': params.data.suppliertype
    });
    
  }
  else{
    this.calloutService.showWarning("This Purchase Request Slip Already Approved. User can't edit");
  }
}

  onDeleteButtonClick(params: any) {
    if(params.data.status != 'Approved'){
    const modalRef = this.modalService.open(ConformationComponent);
    modalRef.componentInstance.details = "Purchase Requisition Slip";
    modalRef.result.then((data) => {
      if (data == "Yes") {
        this.purchaseregslipManager.purchaseslipdelete(params.data.slNo).subscribe((response) => {
          for (let i = 0; i < this.purchaseRegs.length; i++) {
            if (this.purchaseRegs[i].slNo == params.data.slNo) {
              this.purchaseRegs?.splice(i, 1);
              break;
            }
          }
          const selectedRows = params.api.getSelectedRows();
          params.api.applyTransaction({ remove: selectedRows });
          this.gridOptions.api.deselectAll();
          this.calloutService.showSuccess("Purchase Request Removed Successfully");
        });
      }
    })
  }
  else{
    this.calloutService.showWarning("This Purchase Request Slip Already Approved. User can't delete");
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

  onAddbuttonClick(event: any) {

    if (this.f.suppliertype.value == "") {
      this.calloutService.showWarning("please seletct Add items")
    } else {


      const modalRef = this.modalService.open(PurchseSlipComponent, { windowClass: 'my-class' });
      modalRef.componentInstance.purchasereqitem = this.purchasereqitem;
      modalRef.componentInstance.suppiertype = this.f.suppliertype.value;
      modalRef.result.then((data) => {
        if (data.status == 'Yes') {
          this.purchasereqitem = data.purchasereqitem;
          this.TAmount = data.TAmount
          this.consumableTAmount = data.consumableTAmount
          this.childparTAmount = data.childparTAmount
          this.partTAmount = data.partTAmount
        }
      })
    }
  }

  onpurchasereqClick(event: any, purchasereqForm: any) {
    this.markFormGroupTouched(this.purchasereqForm);
    this.submitted = true;
    if (this.purchasereqForm.invalid) {
      return;
    }

    let purchasereqslip001wb = new Purchasereqslip001wb();
    purchasereqslip001wb.date = new Date(this.f.date.value);
    purchasereqslip001wb.poDate = this.f.poDate.value;
    purchasereqslip001wb.reqDate = this.f.reqDate.value;
    purchasereqslip001wb.prsNo = this.f.prsNo.value ? this.f.prsNo.value : "";
    purchasereqslip001wb.poNo = this.f.poNo.value ? this.f.poNo.value : "";
    purchasereqslip001wb.remarks = this.f.remarks.value ? this.f.remarks.value : "";
    purchasereqslip001wb.suppliertype = this.f.suppliertype.value ? this.f.suppliertype.value : "";
    purchasereqslip001wb.purchasereqitem001wbs = this.purchasereqitem ? this.purchasereqitem : 0;
    // purchasereqslip001wb.status = "Request For Approval";

    if (this.TAmount ? (this.TAmount >= 10000) : false) {
      purchasereqslip001wb.status = "Waiting For Request";
    } else if (this.consumableTAmount ? (this.consumableTAmount >= 10000) : false) {
      purchasereqslip001wb.status = "Waiting For Request";
    } else if (this.childparTAmount ? (this.childparTAmount >= 10000) : false) {
      purchasereqslip001wb.status = "Waiting For Request";
    } else if (this.partTAmount ? (this.partTAmount >= 10000) : false) {
      purchasereqslip001wb.status = "Waiting For Request";
    } else {
      purchasereqslip001wb.status = "Approved";
    }

    if (this.slNo) {
      purchasereqslip001wb.slNo = this.slNo;
      purchasereqslip001wb.unitslno = this.unitslno;
      purchasereqslip001wb.insertUser = this.insertUser;
      purchasereqslip001wb.insertDatetime = this.insertDatetime;
      purchasereqslip001wb.updatedUser = this.authManager.getcurrentUser.username;
      purchasereqslip001wb.updatedDatetime = new Date();
      this.purchaseregslipManager.purchaseslipupdate(purchasereqslip001wb).subscribe((response) => {
        this.calloutService.showSuccess("Purchase Request Updated Successfully");
        this.purchasereqForm.reset();
        this.purchasereqitem=[];
        this.purchasereqForm.patchValue(
          { date: this.datepipe.transform(new Date(), 'dd-MM-yyyy') }
        );
        this.loadData();
        this.slNo = null;
        this.submitted = false;
      });
    } else {
      purchasereqslip001wb.date = new Date();
      purchasereqslip001wb.unitslno = this.user.unitslno;
      purchasereqslip001wb.insertUser = this.authManager.getcurrentUser.username;
      purchasereqslip001wb.insertDatetime = new Date();
      this.purchaseregslipManager.purchaseslipsave(purchasereqslip001wb).subscribe((response) => {
        this.calloutService.showSuccess("Purchase Request Saved Successfully");
        this.purchasereqForm.reset();
        this.purchasereqitem=[];
        this.purchasereqForm.patchValue(
          { date: this.datepipe.transform(new Date(), 'dd-MM-yyyy') }
        );
        this.loadData();
        this.submitted = false;
      });
    }
  }

  onReset() {
    this.submitted = false;
    this.purchasereqForm.controls.sparenameSlno.reset();
    this.purchasereqForm.controls.department.reset();
    this.purchasereqForm.controls.prsNo.reset();
    this.purchasereqForm.controls.poDate.reset();
    this.purchasereqForm.controls.reqDate.reset();
    this.purchasereqForm.controls.poNo.reset();
    this.purchasereqForm.controls.description.reset();
    this.purchasereqForm.controls.quantity.reset();
    this.purchasereqForm.controls.remarks.reset();
  }

  onViewClick() {
    this.purchaseregslipManager.purchaslipPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  onGeneratePdfReport() {
    this.purchaseregslipManager.purchaslipPdf(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "purchaseregslip" + newdate);
    })
  }

  onGenerateExcelReport() {
    this.purchaseregslipManager.purchaslipExcel(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "purchaseregslip" + newdate);
    })
  }

  onViewButtonClick(params: any) {
    this.purchaseregslipManager.pdfId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })

  }

  onPdfButtonClick(params: any) {
    this.purchaseregslipManager.pdfId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, params.data.prsNo + "  " + newDate);
    })

  }
  onEXcelButtonClick(params: any) {
    this.purchaseregslipManager.ExcelId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, params.data.prsNo + "  " + newDate);
    })

  }

  onSubmitClick() {
    this.purchaseregslipManager.allpurchaseslip(this.user.unitslno).subscribe(response => {
      this.purchaseRegs = deserialize<Purchasereqslip001wb[]>(Purchasereqslip001wb, response);
  
      let purchasereqslip001wb = new Purchasereqslip001wb();
      for(let i=0;i<1;i++){
        purchasereqslip001wb=this.purchaseRegs[i]
        purchasereqslip001wb.status="Request For Approval"
        this.purchaseregslipManager.purchaseslipupdate(purchasereqslip001wb).subscribe((response) => {
          this.calloutService.showInfo(" Send The Request For Approval");
        });
      }
      this.loadData();
    });
   

    // this.router.navigate(["/app-dash-board/app-approval/app-approval-request"]);
  }
}
