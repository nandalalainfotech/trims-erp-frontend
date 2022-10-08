import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import * as saveAs from 'file-saver';
import { deserialize } from 'serializer.ts/Serializer';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { MaterialInspectionManager } from 'src/app/shared/services/restcontroller/bizservice/Materialinspection.service';
import { MaterialInwardManager } from 'src/app/shared/services/restcontroller/bizservice/Materialinward.service';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { Materialinspection001wb } from 'src/app/shared/services/restcontroller/entities/MaterialInspection001wb';
import { Materialinward001wb } from 'src/app/shared/services/restcontroller/entities/Materialinward001wb';
import { Purchaseorder001wb } from 'src/app/shared/services/restcontroller/entities/Purchaseorder001wb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';
import { StatusBarComponent } from 'src/app/shared/status-bar/status-bar.component';

@Component({
  selector: 'app-quality-checking',
  templateUrl: './quality-checking.component.html',
  styleUrls: ['./quality-checking.component.css']
})
export class QualityCheckingComponent implements OnInit {
  frameworkComponents: any;
  public gridOptions: GridOptions | any;
  public gridOptions1: GridOptions | any;
  minDate = new Date();
  maxDate = new Date();
  materialinward001wbs: Materialinward001wb[] = [];
  purchaseorder001wbs: Purchaseorder001wb[] = [];
  purchaseorder001wb?: Purchaseorder001wb;
  materialinspection001wbs: Materialinspection001wb[] = [];
  user?: Login001mb | any;
  unitslno: number | any;

  constructor(
    private datepipe: DatePipe,
    private modalService: NgbModal,
    private calloutService: CalloutService,
    private authManager: AuthManager,
    private router: Router,
    private materialInwardManager: MaterialInwardManager,
    private materialInspectionManager: MaterialInspectionManager,
  ) {
    this.frameworkComponents = { iconRenderer: IconRendererComponent };
  }

  ngOnInit(): void {
    this.user = this.authManager.getcurrentUser;
    this.createDataGrid001();
    this.createDataGrid002();

    this.materialInwardManager.allinward(this.user.unitslno).subscribe(response => {
      this.materialinward001wbs = deserialize<Materialinward001wb[]>(Materialinward001wb, response);
      if (this.materialinward001wbs.length > 0) {
        this.gridOptions?.api?.setRowData(this.materialinward001wbs);
      } else {
        this.gridOptions?.api?.setRowData([]);
      }
    });

    this.materialInspectionManager.materialinspectionfindall(this.user.unitslno).subscribe(response => {
      this.materialinspection001wbs = deserialize<Materialinspection001wb[]>(Materialinspection001wb, response);
      if (this.materialinspection001wbs.length > 0) {
        this.gridOptions1?.api?.setRowData(this.materialinspection001wbs);
      } else {
        this.gridOptions1?.api?.setRowData([]);
      }
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
        headerName: 'View',
        cellRenderer: 'iconRenderer',
        width: 60,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        cellRendererParams: {
          onClick: this.onViewPurReqParamsClick.bind(this),
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
          onClick: this.onPdfPurReqParamsClick.bind(this),
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
          onClick: this.onExcelPurReqParamsClick.bind(this),
          label: 'Excel',
        },
      },
      {
        headerName: 'Incoming Coming Inspection',
        cellRenderer: 'iconRenderer',
        width: 60,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        cellRendererParams: {
          onClick: this.onIncoming.bind(this),
          label: 'Approval Status',
        },
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
        headerName: 'P.O No',
        // field: 'purchseSlno',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: this.setSupplierName.bind(this)
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
      // {
      //   headerName: 'Delete',
      //   cellRenderer: 'iconRenderer',
      //   width: 85,
      //   // flex: 1,
      //   suppressSizeToFit: true,
      //   cellStyle: { textAlign: 'center' },
      //   cellRendererParams: {
      //     onClick: this.onDeleteButtonClick.bind(this),
      //     label: 'Delete'
      //   },
      // },


    ];
  }

  // setPonocode(params: any): string {
  //   return params.data.purchseSlno ? this.purchaseorder001wbs.find(x => x.slNo === params.data.purchseSlno)?.pono : null;
  // }

  setSupplierName(params: any): string {
    return params.data.purchseSlno ? this.purchaseorder001wbs.find(x => x.slNo === params.data.purchseSlno)?.pono : null;

  }

  
  rowClicked(params: any) {
    params.node.setData({
      ...params.data,
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
    }else if (params.data.status == 'Request For Inspection'){
      return { 'background-color': '#FFA500' };
    }else if (params.data.status == 'Waiting For Request'){
      return { 'background-color': '#FF69B4' };
    }
    return;
  }


  onAuditButtonClick(params: any) {
    const modalRef = this.modalService.open(AuditComponent);
    modalRef.componentInstance.title = "Material Inward Record";
    modalRef.componentInstance.details = params.data
  }

  onEditButtonClick(params: any) {
  }


  // onDeleteButtonClick(params: any) {
  //   const modalRef = this.modalService.open(ConformationComponent);
  //   modalRef.componentInstance.details = "Material Inward Record";
  //   modalRef.result.then((data) => {
  //     if (data == "Yes") {
  //       this.materialInwardManager.inwardDelete(params.data.slNo).subscribe((response) => {
  //         for (let i = 0; i < this.materialinward001wbs.length; i++) {
  //           if (this.materialinward001wbs[i].slNo == params.data.slNo) {
  //             this.materialinward001wbs?.splice(i, 1);
  //             break;
  //           }
  //         }
  //         const selectedRows = params.api.getSelectedRows();
  //         params.api.applyTransaction({ remove: selectedRows });
  //         this.gridOptions.api.deselectAll();
  //         this.calloutService.showSuccess("Material Inward Record Removed Successfully");
  //       });
  //     }
  //   })
  // }

  // onApprovedParamsClick(params: any) {
  //   const modalRef = this.modalService.open(StatusBarComponent);
  //   modalRef.componentInstance.title = 'Approval Status';
  //   modalRef.componentInstance.details = params.data;
  //   modalRef.componentInstance.flag = 'material';
  //   modalRef.result.then((flag) => {
  //     if (flag == 'Yes') {
  //       this.materialInwardManager.allinward().subscribe(response => {
  //         this.materialinward001wbs = deserialize<Materialinward001wb[]>(Materialinward001wb, response);
  //         if (this.materialinward001wbs.length > 0) {
  //           this.gridOptions?.api?.setRowData(this.materialinward001wbs);
  //         } else {
  //           this.gridOptions?.api?.setRowData([]);
  //         }
  //       });
  //     }
  //   });
  // }

  onViewPurReqParamsClick(params: any) {
    this.materialInwardManager
      .pdfId(params.data.slNo,this.user.unitslno)
      .subscribe((response) => {
        var blob = new Blob([response], { type: 'application/pdf' });
        var blobURL = URL.createObjectURL(blob);
        window.open(blobURL);
      });
  }

  onPdfPurReqParamsClick(params: any) {
    console.log('params', params.data.slNo);
    this.materialInwardManager
      .pdfId(params.data.slNo,this.user.unitslno)
      .subscribe((response) => {
        saveAs(response, 'Purchase Req');
      });
  }

  onExcelPurReqParamsClick(params: any) {
    this.materialInwardManager
      .ExcelId(params.data.slNo,this.user.unitslno)
      .subscribe((response) => {
        saveAs(response, 'Purchase Req');
      });
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
      saveAs(response, "Material_Inward_Details");
    })
  }

  onGenerateExcelReport() {
    this.materialInwardManager.materialinwardExcel(this.user.unitslno).subscribe((response) => {
      saveAs(response, "Material_Inward_Details");
    });
  }

  ///////////////////////////////////////////////////////////////////////////////////////

  createDataGrid002(): void {
    this.gridOptions1 = {
      paginationPageSize: 10,
      rowSelection: 'single',
    };
    this.gridOptions1.editType = 'fullRow';
    this.gridOptions1.enableRangeSelection = true;
    this.gridOptions1.animateRows = true;
    this.gridOptions1.columnDefs = [
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
        headerName: 'View',
        cellRenderer: 'iconRenderer',
        width: 60,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        cellRendererParams: {
          onClick: this.onViewPurReqParamsClick.bind(this),
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
          onClick: this.onPdfPurReqParamsClick.bind(this),
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
          onClick: this.onExcelPurReqParamsClick.bind(this),
          label: 'Excel',
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
          onClick: this.onIncomingAuditButtonClick.bind(this),
          label: 'Audit'
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
      //     onClick: this.onIncomminEditButtonClick.bind(this),
      //     label: 'Edit'
      //   },
      // },
      {
        headerName: 'Incoming Inspection Report NO',
        field: 'iirno',
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
          return params.data.cdate ? this.datepipe.transform(params.data.cdate, 'dd-MM-yyyy') : '';
        }
      },
      {
        headerName: 'Supplier/Customer Name',
        field: 'scname',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'DC or Inv.No',
        field: 'dcno',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Other Reference Number',
        field: 'refno',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Date',
        field: 'pdate',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Customer PO Number',
        field: 'cponumber',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Self PO Number',
        field: 'sponumber',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Goods Recieved No',
        field: 'grnumber',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Remark',
        field: 'remark',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      
      // {
      //   headerName: 'Delete',
      //   cellRenderer: 'iconRenderer',
      //   width: 85,
      //   // flex: 1,
      //   suppressSizeToFit: true,
      //   cellStyle: { textAlign: 'center' },
      //   cellRendererParams: {
      //     onClick: this.onIncomingDeleteButtonClick.bind(this),
      //     label: 'Delete'
      //   },
      // },
     

    ];
  }

  onIncomingAuditButtonClick(params: any) {
    const modalRef = this.modalService.open(AuditComponent);
    modalRef.componentInstance.title = "Material Inspection Record";
    modalRef.componentInstance.details = params.data
  }
  onIncomminEditButtonClick(){

  }

  // onIncomingDeleteButtonClick(params: any) {
  //   const modalRef = this.modalService.open(ConformationComponent);
  //   modalRef.componentInstance.details = "Material Inspection Record";
  //   modalRef.result.then((data) => {
  //     if (data == "Yes") {
  //       this.materialInspectionManager.materialinspectionDelete(params.data.slNo).subscribe((response) => {
  //         for (let i = 0; i < this.materialinspection001wbs.length; i++) {
  //           if (this.materialinspection001wbs[i].slNo == params.data.slNo) {
  //             this.materialinspection001wbs?.splice(i, 1);
  //             break;
  //           }
  //         }
  //         const selectedRows = params.api.getSelectedRows();
  //         params.api.applyTransaction({ remove: selectedRows });
  //         this.gridOptions.api.deselectAll();
  //         this.calloutService.showSuccess("Material Inspection Record Removed Successfully");
  //       });
  //     }
  //   })
  // }

  onIncomingViewClick() {
    this.materialInspectionManager.materialinspectionPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  onIncomingGeneratePdfReport() {
    this.materialInspectionManager.materialinspectionPdf(this.user.unitslno).subscribe((response) => {
      saveAs(response, "Material_Inward_Details");
    })
  }

  onIncomingGenerateExcelReport() {
    this.materialInspectionManager.materialinspectionExcel(this.user.unitslno).subscribe((response) => {
      saveAs(response, "Material_Inward_Details");
    });
  }


  onIncoming(){
    this.router.navigate(["/app-dash-board/app-store/app-incoming-inspection-record"]);
  }


}
