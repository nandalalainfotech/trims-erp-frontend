import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { deserialize } from 'serializer.ts/Serializer';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { MaterialRequisitionManager } from 'src/app/shared/services/restcontroller/bizservice/material-req-slip.service';
import { SparesettingManager } from 'src/app/shared/services/restcontroller/bizservice/sparesetting.service';
import { Materialreqslip001wb } from 'src/app/shared/services/restcontroller/entities/material-req-slip001wb';
import { Spares001mb } from 'src/app/shared/services/restcontroller/entities/spares001mb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';
import * as saveAs from 'file-saver';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { MateriealrequestiteManager } from 'src/app/shared/services/restcontroller/bizservice/Materiealrequestitem.service';
import { Materiealrequestitem001wb } from 'src/app/shared/services/restcontroller/entities/Materiealrequestitem001wb';

@Component({
  selector: 'app-material-req-slip',
  templateUrl: './material-req-slip.component.html',
  styleUrls: ['./material-req-slip.component.css']
})
export class MaterialReqSlipComponent implements OnInit {

  frameworkComponents: any;
  public gridOptions1: GridOptions | any;
  public gridOptions2: GridOptions | any;
  public gridOptions3: GridOptions | any;
  public gridOptions4: GridOptions | any;

  MaterialReqForm: FormGroup | any;
  submitted = false;
  slNo: number | any;
  spareSlno: number | any;
  mrsNo: string = "";
  date: Date | any;
  requestorName?: string;
  department: string = "";
  description: string = "";
  qty: number | any;
  remarks: string = "";
  insertUser: string = "";
  insertDatetime: Date | any;
  updatedUser: string | null = "";
  updatedDatetime: Date | any;
  minDate = new Date();
  maxDate = new Date();
  sparesSettings: Spares001mb[] = [];
  spares001mb?: Spares001mb;
  materialrequisitions: Materialreqslip001wb[] = [];
  user?: Login001mb | any;
    unitslno: number | any;
    materiealrequestitem001wbs:Materiealrequestitem001wb[]=[];
    materiealrequestitem001wb?:Materiealrequestitem001wb;
    OrderItems: Materiealrequestitem001wb[] = [];
    ConsumableItems: Materiealrequestitem001wb[] = [];
    ChilpartItems: Materiealrequestitem001wb[] = [];
    PartItems: Materiealrequestitem001wb[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private sparesettingManager: SparesettingManager,
    private authManager: AuthManager,
    private calloutService: CalloutService,
    private modalService: NgbModal,
    private datepipe: DatePipe,
    private materiealrequestiteManager: MateriealrequestiteManager) {
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent
    }
  }

  ngOnInit(): void {
    this.user = this.authManager.getcurrentUser;

    this.maxDate.setFullYear(this.maxDate.getFullYear() + 10);

    this.createDataGrid001();
    this.createDataGrid002();
    this.createDataGrid003();
    this.createDataGrid004();

    this.loadData();


  }


  loadData() {
    this.OrderItems=[];
    this.ConsumableItems=[];
    this.ChilpartItems=[];
    this.PartItems=[];
    this.materiealrequestiteManager.allmateriealrequest(this.user.unitslno).subscribe(response => {
      this.materiealrequestitem001wbs = deserialize<Materiealrequestitem001wb[]>(Materiealrequestitem001wb, response);
     
      for(let i=0;i<this.materiealrequestitem001wbs.length;i++){
        if(this.materiealrequestitem001wbs[i].itemcode){
          this.OrderItems.push(this.materiealrequestitem001wbs[i])
        }
        if(this.materiealrequestitem001wbs[i].cucode){
          this.ConsumableItems.push(this.materiealrequestitem001wbs[i])
        }
        if(this.materiealrequestitem001wbs[i].cptcode){
          this.ChilpartItems.push(this.materiealrequestitem001wbs[i])
        }
        if(this.materiealrequestitem001wbs[i].prtcode){
          this.PartItems.push(this.materiealrequestitem001wbs[i])
        }
      }
      
      if ( this.OrderItems.length > 0) {
        this.gridOptions1?.api?.setRowData( this.OrderItems);
      } else {
        this.gridOptions1?.api?.setRowData([]);
      }
       
      if ( this.ConsumableItems.length > 0) {
        this.gridOptions2?.api?.setRowData( this.ConsumableItems);
      } else {
        this.gridOptions2?.api?.setRowData([]);
      }
       
      if ( this.ChilpartItems.length > 0) {
        this.gridOptions3?.api?.setRowData( this.ChilpartItems);
      } else {
        this.gridOptions3?.api?.setRowData([]);
      }
       
      if ( this.PartItems.length > 0) {
        this.gridOptions4?.api?.setRowData( this.PartItems);
      } else {
        this.gridOptions4?.api?.setRowData([]);
      }
    });
  }

  get f() { return this.MaterialReqForm.controls }

  createDataGrid001(): void {
    this.gridOptions1 = {
      paginationPageSize: 10,
      rowSelection: 'single',
      // onFirstDataRendered: this.onFirstDataRendered.bind(this),
    };
    this.gridOptions1.editType = 'fullRow';
    this.gridOptions1.enableRangeSelection = true;
    this.gridOptions1.animateRows = true;
    this.gridOptions1.columnDefs = [
      {
        headerName: 'Item Code',
        field: 'itemcode',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'item Name',
        field: 'itemname',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Description',
        field: 'descrip',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },

      {
        headerName: 'Re-order Qty',
        field: 'qunty',
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
          return params.data.insertDatetime ? this.datepipe.transform(params.data.insertDatetime, 'dd-MM-yyyy') : '';
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

    ];
  }
  createDataGrid002(): void {
    this.gridOptions2 = {
      paginationPageSize: 10,
      rowSelection: 'single',
      // onFirstDataRendered: this.onFirstDataRendered.bind(this),
    };
    this.gridOptions2.editType = 'fullRow';
    this.gridOptions2.enableRangeSelection = true;
    this.gridOptions2.animateRows = true;
    this.gridOptions2.columnDefs = [
      {
        headerName: 'Consumable Code',
        field: 'cucode',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Consumable Name',
        field: 'cuname',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Description',
        field: 'cudescrip',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },

      {
        headerName: 'Re-order Qty',
        field: 'cuqunty',
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
          return params.data.insertDatetime ? this.datepipe.transform(params.data.insertDatetime, 'dd-MM-yyyy') : '';
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

    ];
  }
  createDataGrid003(): void {
    this.gridOptions3 = {
      paginationPageSize: 10,
      rowSelection: 'single',
      // onFirstDataRendered: this.onFirstDataRendered.bind(this),
    };
    this.gridOptions3.editType = 'fullRow';
    this.gridOptions3.enableRangeSelection = true;
    this.gridOptions3.animateRows = true;
    this.gridOptions3.columnDefs = [
      {
        headerName: 'ChildPart Code',
        field: 'cptcode',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
 
      {
        headerName: 'ChildPart Name',
        field: 'cptname',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Description',
        field: 'cptdescrip',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },

      {
        headerName: 'Re-order Qty',
        field: 'cptqunty',
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
          return params.data.insertDatetime ? this.datepipe.transform(params.data.insertDatetime, 'dd-MM-yyyy') : '';
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

    ];
  }
  createDataGrid004(): void {
    this.gridOptions4 = {
      paginationPageSize: 10,
      rowSelection: 'single',
      // onFirstDataRendered: this.onFirstDataRendered.bind(this),
    };
    this.gridOptions4.editType = 'fullRow';
    this.gridOptions4.enableRangeSelection = true;
    this.gridOptions4.animateRows = true;
    this.gridOptions4.columnDefs = [
      {
        headerName: 'Part Code',
        field: 'prtcode',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Part Name',
        field: 'prtname',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Description',
        field: 'prtdescrip',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },

      {
        headerName: 'Re-order Qty',
        field: 'prtqunty',
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
          return params.data.insertDatetime ? this.datepipe.transform(params.data.insertDatetime, 'dd-MM-yyyy') : '';
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

    ];
  }

  setSpares(params: any): string {
    return params.data.spareSlno2 ? params.data.spareSlno2.spares : null;
  }

  onAuditButtonClick(params: any) {
    const modalRef = this.modalService.open(AuditComponent);
    modalRef.componentInstance.title = "Material Requisition Slip";
    modalRef.componentInstance.details = params.data
  }

  onEditButtonClick(params: any) {
    this.slNo = params.data.slNo;
    this.unitslno = params.data.unitslno;
    this.insertUser = params.data.insertUser;
    this.insertDatetime = params.data.insertDatetime;
    this.MaterialReqForm.patchValue({
      'spareSlno': params.data.spareSlno,
      'mrsNo': params.data.mrsNo,
      'date': params.data.date,
      'requestorName': params.data.requestorName,
      'department': params.data.department,
      'description': params.data.description,
      'qty': params.data.qty,
      'remarks': params.data.remarks,
    });
  }

  onDeleteButtonClick(params: any) {
    // const modalRef = this.modalService.open(ConformationComponent);
    // modalRef.componentInstance.details = "Material Requisition Slip";
    // modalRef.result.then((data) => {
    //   if (data == "Yes") {
    //     this.materialReqManager.materialreqDelete(params.data.slNo).subscribe((response) => {
    //       for (let i = 0; i < this.materialrequisitions.length; i++) {
    //         if (this.materialrequisitions[i].slNo == params.data.slNo) {
    //           this.materialrequisitions?.splice(i, 1);
    //           break;
    //         }
    //       }
    //       const selectedRows = params.api.getSelectedRows();
    //       params.api.applyTransaction({ remove: selectedRows });
    //       this.gridOptions.api.deselectAll();
    //       this.calloutService.showSuccess("Material Request Removed Successfully");
    //     });
    //   }
    // })
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

 

  onReset() {
    this.submitted = false;
    this.MaterialReqForm.controls.spareSlno.reset();
    this.MaterialReqForm.controls.mrsNo.reset();
    this.MaterialReqForm.controls.requestorName.reset();
    this.MaterialReqForm.controls.department.reset();
    this.MaterialReqForm.controls.description.reset();
    this.MaterialReqForm.controls.qty.reset();
    this.MaterialReqForm.controls.description.reset();
    this.MaterialReqForm.controls.remarks.reset();
  }


  itemViewClick() {
    this.materiealrequestiteManager.itemPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  itemPdfReport() {
    this.materiealrequestiteManager.itemPdf(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Mteriealrequest-Details" + newdate);
    })
  }

  itemExcelReport() {
    this.materiealrequestiteManager.itemExcel(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Mteriealrequest-Details" + newdate);
    });
  }

  // ------------consumablePdf-----------------

  consumableViewClick() {
    this.materiealrequestiteManager.consumablePdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  consumablePdfReport() {
    this.materiealrequestiteManager.consumablePdf(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Mteriealrequest-Details" + newdate);
    })
  }

  consumableExcelReport() {
    this.materiealrequestiteManager.consumableExcel(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Mteriealrequest-Details" + newdate);
    });
  }

  // ------Childpart----------------

  childPartViewClick() {
    this.materiealrequestiteManager.childPartPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  childPartPdfReport() {
    this.materiealrequestiteManager.childPartPdf(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Mteriealrequest-Details" + newdate);
    })
  }

  childPartExcelReport() {
    this.materiealrequestiteManager.childPartExcel(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Mteriealrequest-Details" + newdate);
    });
  }

  // ------Part----------

  partViewClick() {
    this.materiealrequestiteManager.PartPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  partPdfReport() {
    this.materiealrequestiteManager.PartPdf(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, ".Mteriealrequest-Details" + newdate);
    })
  }

  partExcelReport() {
    this.materiealrequestiteManager.PartExcel(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Mteriealrequest-Details" + newdate);
    });
  }


  onViewClick() {
    // this.materialReqManager.materialreqslipPdf(this.user.unitslno).subscribe((response) => {
    //   var blob = new Blob([response], { type: 'application/pdf' });
    //   var blobURL = URL.createObjectURL(blob);
    //   window.open(blobURL);
    // })
  }

  onGeneratePdfReport() {
    // this.materialReqManager.materialreqslipPdf(this.user.unitslno).subscribe((response) => {
    //   saveAs(response, "Material_Req_Details");
    // })
  }

  onGenerateExcelReport() {
    // this.materialReqManager.materialreqslipExcel(this.user.unitslno).subscribe((response) => {
    //  saveAs(response, "Material_Req_Details");
    //   });
  }


}