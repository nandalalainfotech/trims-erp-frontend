import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { saveAs } from 'file-saver';
import { forkJoin } from 'rxjs';
import { deserialize } from 'serializer.ts/Serializer';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { PaymentPopupComponent } from 'src/app/shared/payment-popup/payment-popup.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { MaterialInspectionManager } from 'src/app/shared/services/restcontroller/bizservice/Materialinspection.service';
import { MaterialInwardManager } from 'src/app/shared/services/restcontroller/bizservice/Materialinward.service';
import { OrderItemSettingManager } from 'src/app/shared/services/restcontroller/bizservice/orderItems.service';
import { PaymentManager } from 'src/app/shared/services/restcontroller/bizservice/Payment.service';
import { PurchaseInvoicePayManager } from 'src/app/shared/services/restcontroller/bizservice/PurchaseInvoicePay.service';
import { PurchaseorderManager } from 'src/app/shared/services/restcontroller/bizservice/Purchaseorder.service';
import { PurchasereqslipManager } from 'src/app/shared/services/restcontroller/bizservice/Purchasereqslip.service';
import { SalesOrderManager } from 'src/app/shared/services/restcontroller/bizservice/Salesorder.service';
import { SupplierQuotationManager } from 'src/app/shared/services/restcontroller/bizservice/supplierquotation.service';
import { SupplierRegManager } from 'src/app/shared/services/restcontroller/bizservice/supplierReg.service';
import { Materialinspection001wb } from 'src/app/shared/services/restcontroller/entities/MaterialInspection001wb';
import { Materialinward001wb } from 'src/app/shared/services/restcontroller/entities/Materialinward001wb';
import { Orderitem001mb } from 'src/app/shared/services/restcontroller/entities/Orderitem001mb';
import { Payment001wb } from 'src/app/shared/services/restcontroller/entities/Payment001wb';
import { Purchaseinvoicepay001wb } from 'src/app/shared/services/restcontroller/entities/purchaseinvoicepay001wb';
import { Purchaseorder001wb } from 'src/app/shared/services/restcontroller/entities/Purchaseorder001wb';
import { Purchasereqslip001wb } from 'src/app/shared/services/restcontroller/entities/Purchasereqslip001wb';
import { Salesorder001wb } from 'src/app/shared/services/restcontroller/entities/Salesorder001wb';
import { Spares001mb } from 'src/app/shared/services/restcontroller/entities/spares001mb';
import { Status001mb } from 'src/app/shared/services/restcontroller/entities/status001mb';
import { Supplierquotation001wb } from 'src/app/shared/services/restcontroller/entities/supplierquotation001wb ';
import { Supplierregistration001mb } from 'src/app/shared/services/restcontroller/entities/supplierRegistration001mb';
import { User001mb } from 'src/app/shared/services/restcontroller/entities/User001mb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';
import { StatusBarComponent } from 'src/app/shared/status-bar/status-bar.component';

@Component({
    selector: 'app-approval-request',
    templateUrl: './approval-request.component.html',
    styleUrls: ['./approval-request.component.css'],
})
export class ApprovalRequestComponent implements OnInit {
    frameworkComponents: any;

    // GridOptions
    public gridOptions: GridOptions | any;
    public gridOptions1: GridOptions | any;
    public gridOptions2: GridOptions | any;
    public gridOptions3: GridOptions | any;
    public gridOptions4: GridOptions | any;
    public gridOptions5: GridOptions | any;
    public gridOptions6: GridOptions | any;
    public gridOptions7: GridOptions | any;
    public gridOptions8: GridOptions | any;

    // Data
    minDate = new Date();
    maxDate = new Date();
    sparesSettings: Spares001mb[] = [];
    spares001mb?: Spares001mb;
    purchaseRegs: Purchasereqslip001wb[] = [];
    addPopup: any;
    supplierquotations: Supplierquotation001wb[] = [];
    purchasereqs: Purchasereqslip001wb[] = [];
    supplierregs: Supplierregistration001mb[] = [];
    orderitem001mbs: Orderitem001mb[] = [];
    order: Purchaseorder001wb[] = [];
    sales: Salesorder001wb[] = [];
    payment: Payment001wb[] = [];
    statussets: Status001mb[] = [];
    materialinward001wbs: Materialinward001wb[] = [];
    purchaseorder001wbs: Purchaseorder001wb[] = [];
    purchaseorder001wb?: Purchaseorder001wb;
    materialinspection001wbs: Materialinspection001wb[] = [];
    purchaseinvoicepay: Purchaseinvoicepay001wb[] = [];
    suppreg001mb?: Supplierregistration001mb | any;
    user?: User001mb | any;
    unitslno?: any;

    constructor(
        private datepipe: DatePipe,
        private purchaseregslipManager: PurchasereqslipManager,
        private modalService: NgbModal,
        private calloutService: CalloutService,
        private supplierQuotationManager: SupplierQuotationManager,
        private supplierRegManager: SupplierRegManager,
        private purchaseorderManager: PurchaseorderManager,
        private orderItemSettingManager: OrderItemSettingManager,
        private materialInwardManager: MaterialInwardManager,
        private materialInspectionManager: MaterialInspectionManager,
        private salesOrderManager: SalesOrderManager,
        private paymentManager: PaymentManager,
        private authManager: AuthManager,
        private purchaseInvoicePayManager: PurchaseInvoicePayManager,
    ) {
        this.frameworkComponents = { iconRenderer: IconRendererComponent };
    }

    ngOnInit(): void {
        this.user = this.authManager.getcurrentUser;
        this.createDataGrid001();
        this.createDataGrid002();
        this.createDataGrid003();
        this.createDataGrid004();
        this.createDataGrid005();
        this.createDataGrid006();
        this.createDataGrid007();
        this.createDataGrid008();
        this.createDataGrid009();

        this.purchaseregslipManager.allpurchaseslip(this.user.unitslno).subscribe((response) => {
            this.purchaseRegs = deserialize<Purchasereqslip001wb[]>(
                Purchasereqslip001wb,
                response
            );
            if (this.purchaseRegs.length > 0) {
                this.gridOptions?.api?.setRowData(this.purchaseRegs);
            } else {
                this.gridOptions?.api?.setRowData([]);
            }
        });
        this.supplierQuotationManager
            .allSupplierQuotation(this.user.unitslno)
            .subscribe((response) => {
                this.supplierquotations = deserialize<Supplierquotation001wb[]>(
                    Supplierquotation001wb,
                    response
                );
                if (this.supplierquotations.length > 0) {
                    this.gridOptions1?.api?.setRowData(this.supplierquotations);
                } else {
                    this.gridOptions1?.api?.setRowData([]);
                }
            });
        this.purchaseorderManager.allpurchaseorder(this.user.unitslno).subscribe((response) => {
            this.order = deserialize<Purchaseorder001wb[]>(
                Purchaseorder001wb,
                response
            );
            let statuspurchase: Purchaseorder001wb[] = [];

            for (let i = 0; i < this.order.length; i++) {
                if (this.order[i].status != 'Approval') {
                    statuspurchase.push(this.order[i]);
                }
            }
            if (this.order.length > 0) {
                this.gridOptions2?.api?.setRowData(statuspurchase);
            } else {
                this.gridOptions2?.api?.setRowData([]);
            }
        });
        this.authManager.currentUserSubject.subscribe((object: any) => {
            this.user = object;
        });

        let rep0 = this.supplierRegManager.allSupplier(this.user.unitslno);
        let rep1 = this.orderItemSettingManager.allitem(this.user.unitslno);

        forkJoin([rep0, rep1]).subscribe((data: any) => {
            this.supplierregs = deserialize<Supplierregistration001mb[]>(
                Supplierregistration001mb,
                data[0]
            );
            this.orderitem001mbs = deserialize<Orderitem001mb[]>(
                Orderitem001mb,
                data[1]
            );
        });


        this.materialInwardManager.allinward(this.user.unitslno).subscribe(response => {
            this.materialinward001wbs = deserialize<Materialinward001wb[]>(Materialinward001wb, response);
            if (this.materialinward001wbs.length > 0) {
                this.gridOptions6?.api?.setRowData(this.materialinward001wbs);
            } else {
                this.gridOptions6?.api?.setRowData([]);
            }
        });

        this.materialInspectionManager.materialinspectionfindall(this.user.unitslno).subscribe(response => {
            this.materialinspection001wbs = deserialize<Materialinspection001wb[]>(Materialinspection001wb, response);
            if (this.materialinspection001wbs.length > 0) {
                this.gridOptions5?.api?.setRowData(this.materialinspection001wbs);
            } else {
                this.gridOptions5?.api?.setRowData([]);
            }
        });

        this.purchaseInvoicePayManager.allPurchaseInvoicePay(this.user.unitslno).subscribe(response => {
            this.purchaseinvoicepay = deserialize<Purchaseinvoicepay001wb[]>(Purchaseinvoicepay001wb, response);

            if (this.purchaseinvoicepay.length > 0) {
                this.gridOptions7?.api?.setRowData(this.purchaseinvoicepay);
            } else {
                this.gridOptions7?.api?.setRowData([]);
            }
        });


        this.paymentManager.allpayment(this.user.unitslno).subscribe(response => {
            this.payment = deserialize<Payment001wb[]>(Payment001wb, response);
            if (this.payment.length > 0) {
                this.gridOptions8?.api?.setRowData(this.payment);
            } else {
                this.gridOptions8?.api?.setRowData([]);
            }
        });
    }

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
                headerName: 'Approval Status',
                cellRenderer: 'iconRenderer',
                width: 60,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                cellStyle: { textAlign: 'center' },
                cellRendererParams: {
                    onClick: this.onApprovedParamsClick.bind(this),
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
            // {
            //     headerName: 'Edit',
            //     cellRenderer: 'iconRenderer',
            //     width: 80,
            //     // flex: 1,
            //     suppressSizeToFit: true,
            //     cellStyle: { textAlign: 'center' },
            //     cellRendererParams: {
            //         onClick: this.onEditButtonClick.bind(this),
            //         label: 'Edit',
            //     },
            // },

            {
                headerName: 'Audit',
                cellRenderer: 'iconRenderer',
                width: 80,
                // flex: 1,
                suppressSizeToFit: true,
                cellStyle: { textAlign: 'center' },
                cellRendererParams: {
                    onClick: this.onAuditButtonprsClick.bind(this),
                    label: 'Audit',
                },
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
                headerName: 'P.O Date',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: (params: any) => {
                    return params.data.poDate
                        ? this.datepipe.transform(
                            params.data.poDate,
                            'dd-MM-yyyy'
                        )
                        : '';
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
                    onClick: this.onDeleteButtonprsClick.bind(this),
                    label: 'Delete',
                },
            },
        ];
    }

    rowClicked(params: any) {
        params.node.setData({
            ...params.data,
            status: true,
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
        } else if (params.data.status == 'Request For Approval') {
            return { 'background-color': '#FFA500' };
        } else if (params.data.status == 'Waiting For Request') {
            return { 'background-color': '#FF69B4' };
        }
        return;
    }

    setSpares(params: any): string {
        return params.data.sparenameSlno2
            ? params.data.sparenameSlno2.spares
            : null;
    }

    onAuditButtonprsClick(params: any) {
        const modalRef = this.modalService.open(AuditComponent);
        modalRef.componentInstance.title = 'Purchase Requisition Slip';
        modalRef.componentInstance.details = params.data;
    }

    onDeleteButtonprsClick(params: any) {
        const modalRef = this.modalService.open(ConformationComponent);
        modalRef.componentInstance.details = 'Purchase Requisition Slip';
        modalRef.result.then((data) => {
            if (data == 'Yes') {
                this.purchaseregslipManager
                    .purchaseslipdelete(params.data.slNo)
                    .subscribe((response) => {
                        for (let i = 0; i < this.purchaseRegs.length; i++) {
                            if (this.purchaseRegs[i].slNo == params.data.slNo) {
                                this.purchaseRegs?.splice(i, 1);
                                break;
                            }
                        }
                        const selectedRows = params.api.getSelectedRows();
                        params.api.applyTransaction({ remove: selectedRows });
                        this.gridOptions.api.deselectAll();
                        this.calloutService.showSuccess(
                            'Purchase Request Removed Successfully'
                        );
                    });
            }
        });
    }

    // Suplier quation

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
                headerName: 'View',
                cellRenderer: 'iconRenderer',
                width: 60,
                suppressSizeToFit: true,
                cellStyle: { textAlign: 'center' },
                cellRendererParams: {
                    onClick: this.onViewSupClick.bind(this),
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
                    onClick: this.onPdfSupClick.bind(this),
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
                    onClick: this.onExcelSupClick.bind(this),
                    label: 'Excel',
                },
            },
            {
                headerName: 'Approval Status',
                cellRenderer: 'iconRenderer',
                width: 60,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                cellStyle: { textAlign: 'center' },
                cellRendererParams: {
                    onClick: this.onSupplierParamsClick.bind(this),
                    label: 'Approval Status',
                },
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
                headerName: 'Remarks',
                field: 'remarks',
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
            },
            // {
            //     headerName: 'Edit',
            //     cellRenderer: 'iconRenderer',
            //     width: 80,
            //     // flex: 1,
            //     suppressSizeToFit: true,
            //     cellStyle: { textAlign: 'center' },
            //     cellRendererParams: {
            //         onClick: this.onEditButtonClick.bind(this),
            //         label: 'Edit',
            //     },
            // },

            {
                headerName: 'Audit',
                cellRenderer: 'iconRenderer',
                width: 80,
                // flex: 1,
                suppressSizeToFit: true,
                cellStyle: { textAlign: 'center' },
                cellRendererParams: {
                    onClick: this.onAuditButtonsClick.bind(this),
                    label: 'Audit',
                },
            },
            {
                headerName: 'Supplier Name',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setSupplierName.bind(this),
            },
            {
                headerName: 'Quotation Date',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: (params: any) => {
                    return params.data.quotationDate
                        ? this.datepipe.transform(
                            params.data.quotationDate,
                            'dd-MM-yyyy'
                        )
                        : '';
                },
            },
            {
                headerName: 'Validity',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: (params: any) => {
                    return params.data.validity
                        ? this.datepipe.transform(
                            params.data.validity,
                            'dd-MM-yyyy'
                        )
                        : '';
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
                    onClick: this.onDeleteButtonsClick.bind(this),
                    label: 'Delete',
                },
            },
        ];
    }
    setSupplierName(params: any): string {
        return params.data.supplierSlno
            ? this.supplierregs.find((x) => x.slNo === params.data.supplierSlno)
                ?.supplierName
            : null;
    }

    setProductName(params: any): string {
        return params.data.purchasereqSlno2
            ? params.data.purchasereqSlno2.sparenameSlno
            : null;
    }

    onAuditButtonsClick(params: any) {
        const modalRef = this.modalService.open(AuditComponent);
        modalRef.componentInstance.title = 'Supplier Quotation';
        modalRef.componentInstance.details = params.data;
    }
    onDeleteButtonsClick(params: any) {
        const modalRef = this.modalService.open(ConformationComponent);
        modalRef.componentInstance.details = 'Supplier Quotation';
        modalRef.result.then((data) => {
            if (data == 'Yes') {
                this.supplierQuotationManager
                    .SupplierQuotationDelete(params.data.slNo)
                    .subscribe((response) => {
                        for (
                            let i = 0;
                            i < this.supplierquotations.length;
                            i++
                        ) {
                            if (
                                this.supplierquotations[i].slNo ==
                                params.data.slNo
                            ) {
                                this.supplierquotations?.splice(i, 1);
                                break;
                            }
                        }
                        const selectedRows = params.api.getSelectedRows();
                        params.api.applyTransaction({ remove: selectedRows });
                        this.gridOptions.api.deselectAll();
                        this.calloutService.showSuccess(
                            'Supplier Quotation Removed Successfully'
                        );
                    });
            }
        });
    }
    // purshase order---------------------------------------------------------
    createDataGrid003(): void {
        this.gridOptions2 = {
            paginationPageSize: 10,
            rowSelection: 'single',
        };
        this.gridOptions2.editType = 'fullRow';
        this.gridOptions2.enableRangeSelection = true;
        this.gridOptions2.animateRows = true;
        this.gridOptions2.columnDefs = [
            {
                headerName: 'View',
                cellRenderer: 'iconRenderer',
                width: 60,
                suppressSizeToFit: true,
                cellStyle: { textAlign: 'center' },
                cellRendererParams: {
                    onClick: this.onViewPurchaseClick.bind(this),
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
                    onClick: this.onPdfPurchaseClick.bind(this),
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
                    onClick: this.onExcelPurchaseClick.bind(this),
                    label: 'Excel',
                },
            },
            {
                headerName: 'Approval Status',
                cellRenderer: 'iconRenderer',
                width: 60,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                cellStyle: { textAlign: 'center' },
                cellRendererParams: {
                    onClick: this.onPurchaseOrderParamsClick.bind(this),
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

            // {
            //     headerName: 'Edit',
            //     cellRenderer: 'iconRenderer',
            //     width: 80,
            //     // flex: 1,
            //     suppressSizeToFit: true,
            //     cellStyle: { textAlign: 'center' },
            //     cellRendererParams: {
            //         onClick: this.onEditButtonClick.bind(this),
            //         label: 'Edit',
            //     },
            // },

            {
                headerName: 'Audit',
                cellRenderer: 'iconRenderer',
                width: 80,
                // flex: 1,
                suppressSizeToFit: true,
                cellStyle: { textAlign: 'center' },
                cellRendererParams: {
                    onClick: this.onAuditButtonPOClick.bind(this),
                    label: 'Audit',
                },
            },

            {
                headerName: 'Invoice To',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setInvoiceTo.bind(this),
            },
            {
                headerName: 'Consignee No',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setConsigneeNo.bind(this),
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
                    return params.data.date
                        ? this.datepipe.transform(
                            params.data.date,
                            'dd-MM-yyyy'
                        )
                        : '';
                },
            },
            {
                headerName: 'PO No',
                field: 'pono',
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
                    onClick: this.onDeleteButtonPOClick.bind(this),
                    label: 'Delete',
                },
            },
        ];
    }

    setInvoiceTo(params: any): string {
        return params.data.companySlno2
            ? params.data.companySlno2.company
            : null;
    }

    setConsigneeNo(params: any): string {
        return params.data.consigneeSlno2
            ? params.data.consigneeSlno2.consignee
            : null;
    }

    onAuditButtonPOClick(params: any) {
        const modalRef = this.modalService.open(AuditComponent);
        modalRef.componentInstance.title = 'Purchase Order';
        modalRef.componentInstance.details = params.data;
    }

    onDeleteButtonPOClick(params: any) {
        const modalRef = this.modalService.open(ConformationComponent);
        modalRef.componentInstance.details = 'Purchase Order';
        modalRef.result.then((data) => {
            if (data == 'Yes') {
                this.purchaseorderManager
                    .purchaseorderdelete(params.data.slNo)
                    .subscribe((response) => {
                        for (let i = 0; i < this.order.length; i++) {
                            if (this.order[i].slNo == params.data.slNo) {
                                this.order?.splice(i, 1);
                                break;
                            }
                        }
                        const selectedRows = params.api.getSelectedRows();
                        params.api.applyTransaction({ remove: selectedRows });
                        this.gridOptions.api.deselectAll();
                        this.calloutService.showSuccess(
                            'Purchase Order Removed Successfully'
                        );
                    });
            }
        });
    }
    // ---------------------------------------Purchase invoce
    createDataGrid008(): void {
        this.gridOptions7 = {
            paginationPageSize: 10,
            rowSelection: 'single',
            // onFirstDataRendered: this.onFirstDataRendered.bind(this),
        };
        this.gridOptions7.editType = 'fullRow';
        this.gridOptions7.enableRangeSelection = true;
        this.gridOptions7.animateRows = true;
        this.gridOptions7.columnDefs = [
            {
                headerName: 'View',
                cellRenderer: 'iconRenderer',
                width: 60,
                suppressSizeToFit: true,
                cellStyle: { textAlign: 'center' },
                cellRendererParams: {
                    onClick: this.onViewPurInvoiceClick.bind(this),
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
                    onClick: this.onPdfPurInvoiceClick.bind(this),
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
                    onClick: this.onEXcelPurInvoiceClick.bind(this),
                    label: 'Excel',
                },
            },
            {
                headerName: 'Approval Status',
                cellRenderer: 'iconRenderer',
                width: 60,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                cellStyle: { textAlign: 'center' },
                cellRendererParams: {
                    onClick: this.onPurchaseInvoiceParamsClick.bind(this),
                    label: 'Approval Status',
                },
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
                field: 'prsNo',
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
                // valueGetter: this.setSupplierName.bind(this)
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
            {
                headerName: 'Delete',
                cellRenderer: 'iconRenderer',
                width: 85,
                // flex: 1,
                suppressSizeToFit: true,
                cellStyle: { textAlign: 'center' },
                cellRendererParams: {
                    onClick: this.onPIDeleteClick.bind(this),
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
                    onClick: this.onPIAuditClick.bind(this),
                    label: 'Audit'
                },
            },

        ];
    }

    setPONo(params: any): string {
        return params.data.poSlno ? params.data.poSlno2?.pono : null;
    }

    setPRSNo(params: any): string {
        return params.data.poSlno ? params.data.poSlno2?.prsno : null;
    }

    setGRN(params: any): string {
        return params.data.grnNo ? this.materialinspection001wbs.find(x => x.slNo === params.data.grnNo)?.grnumber : "";
    }

    onPIAuditClick(params: any) {
        const modalRef = this.modalService.open(AuditComponent);
        modalRef.componentInstance.title = "Purchase Invoice";
        modalRef.componentInstance.details = params.data
    }

    onPIDeleteClick(params: any) {
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

    onPurchaseInvoiceParamsClick(params: any) {

        let supcode = params.data.suppliercode ? this.supplierquotations.find(x => x.slNo === params.data.suppliercode)?.supplierSlno : null;
        this.suppreg001mb = this.supplierregs.find(x => x.slNo === supcode);

        const modalRef = this.modalService.open(PaymentPopupComponent, { size: 'lg' });
        modalRef.componentInstance.supreg001mb = this.suppreg001mb;
        modalRef.componentInstance.purinvoice001mb = params.data;
        modalRef.result.then((data) => {
            if (data.status == 'Yes') {
            }
        })
    }

    onViewPurInvoiceClick(params: any) {
        this.purchaseInvoicePayManager.purchasInvoicepdfId(params.data.slNo, this.user.unitslno).subscribe((response) => {
            var blob = new Blob([response], { type: 'application/pdf' });
            var blobURL = URL.createObjectURL(blob);
            window.open(blobURL);
        })

    }
    onPdfPurInvoiceClick(params: any) {
        this.purchaseInvoicePayManager.purchasInvoicepdfId(params.data.slNo, this.user.unitslno).subscribe((response) => {
            let date = new Date();
            let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
            saveAs(response, params.data.poSlno2.pono + "  " + newDate);
        })
    }
    onEXcelPurInvoiceClick(params: any) {
        this.purchaseInvoicePayManager.purchasInvoiceExcelId(params.data.slNo, this.user.unitslno).subscribe((response) => {

            let date = new Date();
            let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
            saveAs(response, params.data.poSlno2.pono + "  " + newDate);
        })

    }
    onViewTotalPurInvoiceClick() {
        this.purchaseInvoicePayManager.purchasInvoicePdf(this.user.unitslno).subscribe((response) => {
            var blob = new Blob([response], { type: 'application/pdf' });
            var blobURL = URL.createObjectURL(blob);
            window.open(blobURL);
        })
    }
    onGeneratePurInvoicePdfReport() {
        this.purchaseInvoicePayManager.purchasInvoicePdf(this.user.unitslno).subscribe((response) => {
            let date = new Date();
            let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
            saveAs(response, "purchaseInvoice" + newdate);
        })
    }
    onGeneratePurInvoiceExcelReport() {
        this.purchaseInvoicePayManager.purchasInvoiceExcel(this.user.unitslno).subscribe((response) => {
            let date = new Date();
            let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
            saveAs(response, "purchaseInvoice" + newdate);
        })
    }

    // -----------------------------------------------------------------------------------------
    // Sales invoce
    createDataGrid004(): void {
        this.gridOptions3 = {
            paginationPageSize: 10,
            rowSelection: 'single',
        };
        this.gridOptions3.editType = 'fullRow';
        this.gridOptions3.enableRangeSelection = true;
        this.gridOptions3.animateRows = true;
        this.gridOptions3.columnDefs = [
            {
                headerName: 'View',
                cellRenderer: 'iconRenderer',
                width: 60,
                suppressSizeToFit: true,
                cellStyle: { textAlign: 'center' },
                cellRendererParams: {
                    onClick: this.onEditButtonClick.bind(this),
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
                    onClick: this.onEditButtonClick.bind(this),
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
                    onClick: this.onEditButtonClick.bind(this),
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
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
            },
            {
                headerName: 'Invoice To',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setInvoice.bind(this),
            },
            {
                headerName: 'Consignee No',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setConsignee.bind(this),
            },
            {
                headerName: 'Buyer',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setBuyer.bind(this),
            },
            {
                headerName: 'Invoice No',
                field: 'invoiceNo',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
            },
            {
                headerName: 'Date',
                field: 'date',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: (params: any) => {
                    return params.data.date
                        ? this.datepipe.transform(
                            params.data.date,
                            'dd-MM-yyyy'
                        )
                        : '';
                },
            },
            {
                headerName: 'Delivery Note',
                field: 'deliveryNote',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
            },
            {
                headerName: 'Mode of terms',
                field: 'modePay',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
            },
            {
                headerName: 'Reference No',
                field: 'refNoDate',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
            },
            {
                headerName: 'Other Reference',
                field: 'otherRef',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
            },
            {
                headerName: 'Buyers Order No',
                field: 'buyerOrderNo',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
            },
            {
                headerName: 'Buyers Date',
                field: 'buyerDate',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: (params: any) => {
                    return params.data.date
                        ? this.datepipe.transform(
                            params.data.date,
                            'dd-MM-yyyy'
                        )
                        : '';
                },
            },
            {
                headerName: 'Dispatch Doc No',
                field: 'dispatchDocNo',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
            },
            {
                headerName: 'Delivery Note Date',
                field: 'deliveryNoteDate',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
            },
            {
                headerName: 'Dispatched Through',
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
                headerName: 'Billing Of Landing',
                field: 'billOfLading',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
            },
            {
                headerName: 'Motor Vehicle No',
                field: 'motorvehicleNo',
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
                headerName: 'Description Of Goods',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setDescription.bind(this),
            },
            {
                headerName: 'HSN/SAC',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setHsn.bind(this),
            },
            {
                headerName: 'Part No',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setPartno.bind(this),
            },
            {
                headerName: 'Quantity',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setQuantity.bind(this),
            },
            {
                headerName: 'Rate',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setRate.bind(this),
            },
            {
                headerName: 'Amount',
                field: 'amount',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setAmount.bind(this),
            },
            // {
            //     headerName: 'Edit',
            //     cellRenderer: 'iconRenderer',
            //     width: 80,
            //     // flex: 1,
            //     suppressSizeToFit: true,
            //     cellStyle: { textAlign: 'center' },
            //     cellRendererParams: {
            //         onClick: this.onEditButtonClick.bind(this),
            //         label: 'Edit',
            //     },
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
                    label: 'Delete',
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
                    label: 'Audit',
                },
            },
        ];
    }

    setInvoice(params: any): string {
        return params.data.porderSlno2
            ? params.data.porderSlno2.supplierFrom
            : null;
    }

    setConsignee(params: any): string {
        return params.data.porderSlno2
            ? params.data.porderSlno2.consigneeSlno2?.consignee
            : null;
    }

    setBuyer(params: any): string {
        return params.data.porderSlno2
            ? params.data.porderSlno2.companySlno2?.company
            : null;
    }

    setDescription(params: any): string {
        return params.data.porderSlno2
            ? params.data.porderSlno2.suppquotSlno2?.description
            : null;
    }

    setHsn(params: any): string {
        return params.data.porderSlno2 ? params.data.porderSlno2.hsn : null;
    }

    setPartno(params: any): string {
        return params.data.porderSlno2 ? params.data.porderSlno2.partNo : null;
    }

    setQuantity(params: any): string {
        return params.data.porderSlno2
            ? params.data.porderSlno2.suppquotSlno2?.quantity
            : null;
    }

    setRate(params: any): string {
        return params.data.porderSlno2
            ? params.data.porderSlno2.suppquotSlno2?.price
            : null;
    }

    setAmount(params: any): string {
        return params.data.porderSlno2 ? params.data.porderSlno2.amount : null;
    }

    createDataGrid005(): void {
        this.gridOptions4 = {
            paginationPageSize: 10,
            rowSelection: 'single',
        };
        this.gridOptions4.editType = 'fullRow';
        this.gridOptions4.enableRangeSelection = true;
        this.gridOptions4.animateRows = true;
        this.gridOptions4.columnDefs = [
            {
                headerName: 'View',
                cellRenderer: 'iconRenderer',
                width: 60,
                suppressSizeToFit: true,
                cellStyle: { textAlign: 'center' },
                cellRendererParams: {
                    onClick: this.onEditButtonClick.bind(this),
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
                    onClick: this.onEditButtonClick.bind(this),
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
                    onClick: this.onEditButtonClick.bind(this),
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
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
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
                headerName: 'Invoice No',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setInvoiceNo.bind(this),
            },
            {
                headerName: 'Invoice Amount',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: this.setInvoiceAmount.bind(this),
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
                    return params.data.payDate
                        ? this.datepipe.transform(
                            params.data.payDate,
                            'dd-MM-yyyy'
                        )
                        : '';
                },
            },
            {
                headerName: 'Payment Status',
                field: 'payStatus',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
            },
            {
                headerName: 'Due Date',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                valueGetter: (params: any) => {
                    return params.data.dueDate
                        ? this.datepipe.transform(
                            params.data.dueDate,
                            'dd-MM-yyyy'
                        )
                        : '';
                },
            },
            {
                headerName: 'GST No',
                field: 'gstNo',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
            },
            {
                headerName: 'GST Percentage',
                field: 'gstPercent',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
            },
            {
                headerName: 'GST Amount',
                field: 'gstAmount',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
            },
            {
                headerName: 'Total Amount',
                field: 'totalAmount',
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
            //     headerName: 'Edit',
            //     cellRenderer: 'iconRenderer',
            //     width: 80,
            //     // flex: 1,
            //     suppressSizeToFit: true,
            //     cellStyle: { textAlign: 'center' },
            //     cellRendererParams: {
            //         onClick: this.onEditButtonClick.bind(this),
            //         label: 'Edit',
            //     },
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
                    label: 'Delete',
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
                    label: 'Audit',
                },
            },
        ];
    }

    setInvoiceNo(params: any): string {
        return params.data.saleorderSlno2
            ? params.data.saleorderSlno2.invoiceNo
            : null;
    }

    setInvoiceAmount(params: any): string {
        return params.data.saleorderSlno2.porderSlno2
            ? params.data.saleorderSlno2.porderSlno2.amount
            : null;
    }

    onEditButtonClick() { }
    onDeleteButtonClick() { }
    onAuditButtonClick() { }
    ///////////////////////////////////////////////////////////////////////////////////////////
    createDataGrid006(): void {
        this.gridOptions6 = {
            paginationPageSize: 10,
            rowSelection: 'single',
            // onFirstDataRendered: this.onFirstDataRendered.bind(this),
        };
        this.gridOptions6.editType = 'fullRow';
        this.gridOptions6.enableRangeSelection = true;
        this.gridOptions6.animateRows = true;
        this.gridOptions6.columnDefs = [
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
                    onClick: this.onMaterialViewParamsClick.bind(this),
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
                    onClick: this.onMaterialPdfParamsClick.bind(this),
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
                    onClick: this.onMaterialExcelParamsClick.bind(this),
                    label: 'Excel',
                },
            },
            {
                headerName: 'Approval Status',
                cellRenderer: 'iconRenderer',
                width: 60,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                cellStyle: { textAlign: 'center' },
                cellRendererParams: {
                    onClick: this.onMaterialApprovedParamsClick.bind(this),
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
                    onClick: this.onMaterialAuditButtonClick.bind(this),
                    label: 'Audit'
                },
            },

            // {
            //     headerName: 'Edit',
            //     cellRenderer: 'iconRenderer',
            //     width: 80,
            //     // flex: 1,
            //     suppressSizeToFit: true,
            //     cellStyle: { textAlign: 'center' },
            //     cellRendererParams: {
            //         onClick: this.onMaterialEditButtonClick.bind(this),
            //         label: 'Edit'
            //     },
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
                valueGetter: this.setMaterialSupplierName.bind(this)
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

    // setPonocode(params: any): string {
    //   return params.data.purchseSlno ? this.purchaseorder001wbs.find(x => x.slNo === params.data.purchseSlno)?.pono : null;
    // }

    setMaterialSupplierName(params: any): string {
        return params.data.purchseSlno ? this.purchaseorder001wbs.find(x => x.slNo === params.data.purchseSlno)?.pono : null;

    }

    //   rowClicked(params: any) {
    //     params.node.setData({
    //       ...params.data,
    //       status: true,
    //     });
    //   }

    //   getRowStyle(params) {
    //     if (params.data.status == 'Approved') {
    //       return { 'background-color': 'lightgreen' };
    //     } else if (params.data.status == 'Partially Approved') {
    //       return { 'background-color': '#FFFF00' };
    //     } else if (params.data.status == 'Hold') {
    //       return { 'background-color': 'lightblue' };
    //     } else if (params.data.status == 'Reject') {
    //       return { 'background-color': '#ff8080' };
    //     }
    //     return;
    //   }


    onMaterialAuditButtonClick(params: any) {
        const modalRef = this.modalService.open(AuditComponent);
        modalRef.componentInstance.title = "Material Inward Record";
        modalRef.componentInstance.details = params.data
    }

    onMaterialEditButtonClick(params: any) {
    }


    onMaterialDeleteButtonClick(params: any) {
        const modalRef = this.modalService.open(ConformationComponent);
        modalRef.componentInstance.details = "Material Inward Record";
        modalRef.result.then((data) => {
            if (data == "Yes") {
                this.materialInwardManager.inwardDelete(params.data.slNo).subscribe((response) => {
                    for (let i = 0; i < this.materialinward001wbs.length; i++) {
                        if (this.materialinward001wbs[i].slNo == params.data.slNo) {
                            this.materialinward001wbs?.splice(i, 1);
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

    onMaterialApprovedParamsClick(params: any) {
        const modalRef = this.modalService.open(StatusBarComponent);
        modalRef.componentInstance.title = 'Approval Status';
        modalRef.componentInstance.details = params.data;
        modalRef.componentInstance.flag = 'material';
        modalRef.result.then((flag) => {
            if (flag == 'Yes') {
                this.materialInwardManager.allinward(this.user.unitslno).subscribe(response => {
                    this.materialinward001wbs = deserialize<Materialinward001wb[]>(Materialinward001wb, response);
                    if (this.materialinward001wbs.length > 0) {
                        this.gridOptions?.api?.setRowData(this.materialinward001wbs);
                    } else {
                        this.gridOptions?.api?.setRowData([]);
                    }
                });
            }
        });
    }

    onMaterialViewParamsClick(params: any) {
        this.materialInwardManager
            .pdfId(params.data.slNo, this.user.unitslno)
            .subscribe((response) => {
                var blob = new Blob([response], { type: 'application/pdf' });
                var blobURL = URL.createObjectURL(blob);
                window.open(blobURL);
            });
    }

    onMaterialPdfParamsClick(params: any) {
        console.log('params', params.data.slNo);
        this.materialInwardManager
            .pdfId(params.data.slNo, this.user.unitslno)
            .subscribe((response) => {
                saveAs(response, 'Purchase Req');
            });
    }

    onMaterialExcelParamsClick(params: any) {
        this.materialInwardManager
            .ExcelId(params.data.slNo, this.user.unitslno)
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
    // //////////////////////////////////////////////////////////////////////
    onViewPurchaseReqClick() {
        this.purchaseregslipManager.purchaslipPdf(this.user.unitslno).subscribe((response) => {
            var blob = new Blob([response], { type: 'application/pdf' });
            var blobURL = URL.createObjectURL(blob);
            window.open(blobURL);
        });
    }
    onGeneratePurchaseReqPdfReport() {
        this.purchaseregslipManager.purchaslipPdf(this.user.unitslno).subscribe((response) => {
            let date = new Date();
            let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
            saveAs(response, "purchaseregslip" + newdate);
        });
    }

    onGeneratePurchaseReqExcelReport() {
        this.purchaseregslipManager.purchaslipExcel(this.user.unitslno).subscribe((response) => {
            let date = new Date();
            let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
            saveAs(response, "purchaseregslip" + newdate);
        });
    }
    onViewPurReqParamsClick(params: any) {
        this.purchaseregslipManager.pdfId(params.data.slNo, this.user.unitslno).subscribe((response) => {
            var blob = new Blob([response], { type: 'application/pdf' });
            var blobURL = URL.createObjectURL(blob);
            window.open(blobURL);
          })
    }
    onPdfPurReqParamsClick(params: any) {
        this.purchaseregslipManager.pdfId(params.data.slNo, this.user.unitslno).subscribe((response) => {
            let date = new Date();
            let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
            saveAs(response, params.data.prsNo + "  " + newDate);
          });
    }
    onExcelPurReqParamsClick(params: any) {
        this.purchaseregslipManager.ExcelId(params.data.slNo, this.user.unitslno).subscribe((response) => {
            let date = new Date();
            let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
            saveAs(response, params.data.prsNo + "  " + newDate);
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////
    onViewSupplierQuoClick() {
        this.supplierQuotationManager.supplierQuotationPdf(this.user.unitslno).subscribe((response) => {
            var blob = new Blob([response], { type: 'application/pdf' });
            var blobURL = URL.createObjectURL(blob);
            window.open(blobURL);
        });
    }
    onGenerateSupplierQuoPdfReport() {
        this.supplierQuotationManager.supplierQuotationPdf(this.user.unitslno).subscribe((response) => {
            let date = new Date();
            let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
            saveAs(response, "supplierQuotation" + newdate);
        });
    }

    onGenerateSupplierQuoExcelReport() {
        this.supplierQuotationManager.supplierQuotationExcel(this.user.unitslno).subscribe((response) => {
            let date = new Date();
            let newdate = this.datepipe.transform(date, 'dd-MM-yyyy')
            saveAs(response, "supplierQuotation" + newdate);
          })
    }
    onViewSupClick(params: any) {
        this.supplierQuotationManager.paramsPdf(params.data.slNo, this.user.unitslno).subscribe((response) => {
            var blob = new Blob([response], { type: 'application/pdf' });
            var blobURL = URL.createObjectURL(blob);
            window.open(blobURL);
        })
    }
    onPdfSupClick(params: any) {
        this.supplierQuotationManager.paramsPdf(params.data.slNo, this.user.unitslno).subscribe((response) => {
            let date = new Date();
            let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
            saveAs(response, params.data.supplierSlno2.supplierCode + "  " + newDate);
      
        })
    }
    onExcelSupClick(params: any) {
        this.supplierQuotationManager.supplierExcel(params.data.slNo, this.user.unitslno).subscribe((response) => {
            let date = new Date();
            let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
            saveAs(response, params.data.supplierSlno2.supplierCode + "  " + newDate);
        })
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
    onViewPOrderClick() {
        this.purchaseorderManager.purchaseorderPdf(this.user.unitslno).subscribe((response) => {
            var blob = new Blob([response], { type: 'application/pdf' });
            var blobURL = URL.createObjectURL(blob);
            window.open(blobURL);
          })
    }

    onGeneratePOrderPdfReport() {
        this.purchaseorderManager.purchaseorderPdf(this.user.unitslno).subscribe((response) => {
            let date = new Date();
            let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
            saveAs(response, "Purchase Order" + newdate);
          })
    }

    onGeneratePOrderExcelReport() {
        this.purchaseorderManager.purchaseorderExcel(this.user.unitslno).subscribe((response) => {
            let date = new Date();
            let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
            saveAs(response, "Purchase Order" + newdate);
          })
    }
    onViewPurchaseClick(params: any) {
        this.purchaseorderManager.purchaseParamsPdf(params.data.slNo, this.user.unitslno).subscribe((response) => {
            var blob = new Blob([response], { type: 'application/pdf' });
            var blobURL = URL.createObjectURL(blob);
            window.open(blobURL);
          })
    }
    onPdfPurchaseClick(params: any) {
        this.purchaseorderManager.purchaseParamsPdf(params.data.slNo, this.user.unitslno).subscribe((response) => {
            let date = new Date();
            let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
            saveAs(response, params.data.pono + "  " + newDate);
          })
    }
    onExcelPurchaseClick(params: any) {
        this.purchaseorderManager.purchaseordersingleExcel(params.data.slNo, this.user.unitslno).subscribe((response) => {
            let date = new Date();
            let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
            saveAs(response, params.data.pono + "  " + newDate);
          })
    }

    onViewSalesClick() {
        this.salesOrderManager.onGeneratePdfReport().subscribe((response) => {
            var blob = new Blob([response], { type: 'application/pdf' });
            var blobURL = URL.createObjectURL(blob);
            window.open(blobURL);
        });
    }

    onGenerateSalesPdfReport() {
        this.salesOrderManager.onGeneratePdfReport().subscribe((response) => {
            saveAs(response, 'Sales Invoice');
        });
    }

    onGenerateSalesExcelReport() {
        this.salesOrderManager.onGenerateExcelReport().subscribe((response) => {
            saveAs(response, 'Sales Invoice');
        });
    }

    onViewPaymentClick() {
        this.paymentManager.paymentPdf(this.user.unitslno).subscribe((response) => {
            var blob = new Blob([response], { type: 'application/pdf' });
            var blobURL = URL.createObjectURL(blob);
            window.open(blobURL);
        });
    }

    onGeneratePaymentPdfReport() {
        this.paymentManager.paymentPdf(this.user.unitslno).subscribe((response) => {
            saveAs(response, 'payment');
        });
    }

    onGeneratePaymentExcelReport() {
        this.paymentManager.paymentExcel(this.user.unitslno).subscribe((response) => {
            saveAs(response, 'payment');
        });
    }

    onApprovedParamsClick(params: any) {
        const modalRef = this.modalService.open(StatusBarComponent);
        modalRef.componentInstance.title = 'Approval Status';
        modalRef.componentInstance.details = params.data;
        modalRef.componentInstance.flag = 'PRS';
        modalRef.result.then((flag) => {
            if (flag == 'Yes') {
                this.purchaseregslipManager
                    .allpurchaseslip(this.user.unitslno)
                    .subscribe((response) => {
                        this.purchaseRegs = deserialize<Purchasereqslip001wb[]>(
                            Purchasereqslip001wb,
                            response
                        );
                        if (this.purchaseRegs.length > 0) {
                            this.gridOptions?.api?.setRowData(
                                this.purchaseRegs
                            );
                        } else {
                            this.gridOptions?.api?.setRowData([]);
                        }
                    });
            }
        });
    }
    onPurchaseOrderParamsClick(params: any) {
        const modalRef = this.modalService.open(StatusBarComponent);
        modalRef.componentInstance.title = 'Approval Status';
        modalRef.componentInstance.details = params.data;
        modalRef.componentInstance.flag = 'PO';
        modalRef.result.then((flag) => {
            if (flag == 'Yes') {
                this.purchaseorderManager
                    .allpurchaseorder(this.user.unitslno)
                    .subscribe((response) => {
                        this.order = deserialize<Purchaseorder001wb[]>(
                            Purchaseorder001wb,
                            response
                        );
                        if (this.order.length > 0) {
                            this.gridOptions2?.api?.setRowData(this.order);
                        } else {
                            this.gridOptions2?.api?.setRowData([]);
                        }
                    });
            }
        });
    }

    onSupplierParamsClick(params: any) {
        const modalRef = this.modalService.open(StatusBarComponent);
        modalRef.componentInstance.title = 'Approval Status';
        modalRef.componentInstance.details = params.data;
        modalRef.componentInstance.flag = 'SQ';
        modalRef.result.then((flag) => {
            if (flag == 'Yes') {
                this.supplierQuotationManager
                    .allSupplierQuotation(this.user.unitslno)
                    .subscribe((response) => {
                        this.supplierquotations = deserialize<
                            Supplierquotation001wb[]
                        >(Supplierquotation001wb, response);
                        if (this.supplierquotations.length > 0) {
                            this.gridOptions1?.api?.setRowData(
                                this.supplierquotations
                            );
                        } else {
                            this.gridOptions1?.api?.setRowData([]);
                        }
                    });
            }
        });
    }
    /////////////////////////////////////////////////////////////

    createDataGrid007(): void {
        this.gridOptions5 = {
            paginationPageSize: 10,
            rowSelection: 'single',
        };
        this.gridOptions5.editType = 'fullRow';
        this.gridOptions5.enableRangeSelection = true;
        this.gridOptions5.animateRows = true;
        this.gridOptions5.columnDefs = [
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
            //     headerName: 'Edit',
            //     cellRenderer: 'iconRenderer',
            //     width: 80,
            //     // flex: 1,
            //     suppressSizeToFit: true,
            //     cellStyle: { textAlign: 'center' },
            //     cellRendererParams: {
            //         onClick: this.onIncomminEditButtonClick.bind(this),
            //         label: 'Edit'
            //     },
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

            {
                headerName: 'Delete',
                cellRenderer: 'iconRenderer',
                width: 85,
                // flex: 1,
                suppressSizeToFit: true,
                cellStyle: { textAlign: 'center' },
                cellRendererParams: {
                    onClick: this.onIncomingDeleteButtonClick.bind(this),
                    label: 'Delete'
                },
            },


        ];
    }

    onIncomingAuditButtonClick(params: any) {
        const modalRef = this.modalService.open(AuditComponent);
        modalRef.componentInstance.title = "Material Inspection Record";
        modalRef.componentInstance.details = params.data
    }
    onIncomminEditButtonClick() {

    }

    onIncomingDeleteButtonClick(params: any) {
        const modalRef = this.modalService.open(ConformationComponent);
        modalRef.componentInstance.details = "Material Inspection Record";
        modalRef.result.then((data) => {
            if (data == "Yes") {
                this.materialInspectionManager.materialinspectionDelete(params.data.slNo).subscribe((response) => {
                    for (let i = 0; i < this.materialinspection001wbs.length; i++) {
                        if (this.materialinspection001wbs[i].slNo == params.data.slNo) {
                            this.materialinspection001wbs?.splice(i, 1);
                            break;
                        }
                    }
                    const selectedRows = params.api.getSelectedRows();
                    params.api.applyTransaction({ remove: selectedRows });
                    this.gridOptions.api.deselectAll();
                    this.calloutService.showSuccess("Material Inspection Record Removed Successfully");
                });
            }
        })
    }

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



    createDataGrid009(): void {
        this.gridOptions8 = {
            paginationPageSize: 10,
            rowSelection: 'single',
            // onFirstDataRendered: this.onFirstDataRendered.bind(this),
        };
        this.gridOptions8.editType = 'fullRow';
        this.gridOptions8.enableRangeSelection = true;
        this.gridOptions8.animateRows = true;
        this.gridOptions8.columnDefs = [
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

    rowClicked1(params: any) {
        params.node.setData({
            ...params.data,
        });
    }

    getRowStyle1(params) {
        console.log("params", params);

        if (params.data.status == 'Paid') {
            return { 'background-color': '#ff0080' };
        } else if (params.data.status == 'Partially Paid') {
            return { 'background-color': '#0080ff' };
        }
        return;
    }


}
