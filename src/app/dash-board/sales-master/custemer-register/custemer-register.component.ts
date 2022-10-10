import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import * as saveAs from 'file-saver';
import { deserialize } from 'serializer.ts/Serializer';
import { AddCustomerContactComponent } from 'src/app/shared/add-customer-contact/add-customer-contact.component';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { CustmerRegManager } from 'src/app/shared/services/restcontroller/bizservice/CustemerRegistration.service';
import { Custemerregistration001mb } from 'src/app/shared/services/restcontroller/entities/Custemerregistration001mb';
import { Customercontact001wb } from 'src/app/shared/services/restcontroller/entities/Customercontact001wb';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';
import { DataSharedService } from 'src/app/shared/services/services/datashared.service';

@Component({
    selector: 'app-custemer-register',
    templateUrl: './custemer-register.component.html',
    styleUrls: ['./custemer-register.component.css']
})
export class CustemerRegisterComponent implements OnInit {
    custemerRegForm: FormGroup | any;
    frameworkComponents: any;
    submitted = false;
    public gridOptions: GridOptions | any;
    slNo: number | any;
    custemername: string = "";
    custemercode: string = "";
    // consignee: string = "";
    website: string = "";
    address: string = "";
    // contact: string = "";
    gstin: string = "";
    certification: string = "";
    nature: string = "";
    productDesc: string = "";
    reputedCust: string = "";
    concern?: string = "";
    otherInfo: string = "";
    insertUser: string = "";
    insertDatetime?: Date;
    updatedUser: string = "";
    updatedDatetime?: Date | null;
    isOpen: boolean = false;
    parentMenuString: string = '';
    childMenuString: string = '';
    isActive: boolean | undefined;
    themes: any;
    color: any;
    addPopup: string = "";

    custemerregistration001mb: Custemerregistration001mb[] = [];
    custmerReg: Custemerregistration001mb[] = [];
    customercontacts: Customercontact001wb[] = [];
    // customercontacts2?: Customercontact001wb[]=[];
    getCount: any;
    count: number = 0;
    user?: Login001mb | any;
    unitslno: number | any;
    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private calloutService: CalloutService,
        private datepipe: DatePipe,
        private dataSharedService: DataSharedService,
        private custmerRegManager: CustmerRegManager,
        private authManager: AuthManager,
        private modalService: NgbModal,
        private httpClient: HttpClient, private http: HttpClient) {
        this.frameworkComponents = {
            iconRenderer: IconRendererComponent
        }

    }


    ngOnInit(): void {
        this.user = this.authManager.getcurrentUser;
        this.createDataGrid001();
        this.custemerRegForm = this.formBuilder.group({
            custemername: ['', Validators.required],
            custemercode: ['', Validators.required],
            // consignee: ['', Validators.required],
            address: ['', Validators.required],
            // contact: ['', Validators.required],
            gstin: ['', [Validators.required,
                Validators.minLength(11), Validators.maxLength(11)]],
            certification: ['', Validators.required],
            // nature: ['', Validators.required],
            productDesc: ['', Validators.required],
            reputedCust: ['', Validators.required],
            concern: ['', Validators.required],
            otherInfo: ['', Validators.required],
            website: ['', Validators.required],
        })

        this.loadData();
    }
    loadData() {
        this.custmerRegManager.allCustmerreg(this.user.unitslno).subscribe(response => {
            this.custmerReg = deserialize<Custemerregistration001mb[]>(Custemerregistration001mb, response);
            if (this.custmerReg.length > 0) {
                this.gridOptions?.api?.setRowData(this.custmerReg);
            } else {
                this.gridOptions?.api?.setRowData([]);
            }
        });

        this.custmerRegManager.getCount().subscribe(response => {
            this.count = response[0].row == 0 ? 1 : parseInt(response[0].row) + 1;
            this.custemerRegForm.patchValue({
                custemercode: String("SE/CC/") + String(this.count).padStart(5, '0')
            });
          });
    }
    get f() { return this.custemerRegForm.controls; }

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
                headerName: 'Custemer Code',
                field: 'custemercode',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                // valueGetter: this.setMachineCode.bind(this)
            },
            {
                headerName: 'Custemer Name',
                field: 'custemername',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                // valueGetter: this.setMachineCode.bind(this)
            },
            // {
            //     headerName: 'consignee Name',
            //     field: 'consignee',
            //     width: 200,
            //     // flex: 1,
            //     sortable: true,
            //     filter: true,
            //     resizable: true,
            //     suppressSizeToFit: true,
            //     // valueGetter: this.setMachineCode.bind(this)
            // },
            {
                headerName: 'Address',
                field: 'address',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
                // valueGetter: this.setMachineName.bind(this)
            },
            // {
            //     headerName: 'Contact',
            //     field: 'contact',
            //     width: 200,
            //     // flex: 1,
            //     sortable: true,
            //     filter: true,
            //     resizable: true,
            //     suppressSizeToFit: true
            // },
            {
                headerName: 'GSTIN',
                field: 'gstin',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true
            },
            {
                headerName: 'Certifications',
                field: 'certification',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true
            },
            // {
            //     headerName: 'Nature Of Supplier',
            //     field: 'nature',
            //     width: 200,
            //     // flex: 1,
            //     sortable: true,
            //     filter: true,
            //     resizable: true,
            //     suppressSizeToFit: true
            // },
            {
                headerName: 'Product Description',
                field: 'productDesc',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true
            },
            {
                headerName: 'Reputed Customers',
                field: 'reputedCust',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true
            },
            {
                headerName: 'Concerns',
                field: 'concern',
                // field: 'date',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true,
            },
            {
                headerName: 'Other Info',
                field: 'otherInfo',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true
            },
            {
                headerName: 'Web Site',
                field: 'website',
                width: 200,
                // flex: 1,
                sortable: true,
                filter: true,
                resizable: true,
                suppressSizeToFit: true
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

    onEditButtonClick(params: any) {
        this.slNo = params.data.slNo;
        this.unitslno = params.data.unitslno;
        this.customercontacts = params.data.customercontact001wbs;
        this.insertUser = params.data.insertUser;
        this.insertDatetime = params.data.insertDatetime;
        this.custemerRegForm.patchValue({
            'custemername': params.data.custemername,
            'custemercode': params.data.custemercode,
            // 'consignee': params.data.consignee,
            'address': params.data.address,
            // 'contact': params.data.contact,
            'gstin': params.data.gstin,
            'certification': params.data.certification,
            // 'nature': params.data.nature,
            'productDesc': params.data.productDesc,
            'reputedCust': params.data.reputedCust,
            'concern': params.data.concern,
            'otherInfo': params.data.otherInfo,
            'website': params.data.website,
        });
    }

    onDeleteButtonClick(params: any) {
        const modalRef = this.modalService.open(ConformationComponent);
        modalRef.componentInstance.details = "Supplier Registration Form";
        modalRef.result.then((data) => {
            if (data == "Yes") {
                this.custmerRegManager.CustmerregDelete(params.data.slNo).subscribe((response) => {
                    for (let i = 0; i < this.custmerReg.length; i++) {
                        if (this.custmerReg[i].slNo == params.data.slNo) {
                            this.custmerReg?.splice(i, 1);
                            break;
                        }
                    }
                    const selectedRows = params.api.getSelectedRows();
                    params.api.applyTransaction({ remove: selectedRows });
                    this.gridOptions.api.deselectAll();
                    this.calloutService.showSuccess("Supplier Registration Details Removed Successfully");
                });
            }
        })
    }

    onAuditButtonClick(params: any) {
        const modalRef = this.modalService.open(AuditComponent);
        modalRef.componentInstance.title = "Supplier Registration Form";
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

    onCustemerRegClick(event: any, custemerRegForm: any) {
        
        this.markFormGroupTouched(this.custemerRegForm);
        this.submitted = true;
        if (this.custemerRegForm.invalid) {
            return;
        }
       
        let custemerregistration001mb = new Custemerregistration001mb();
        custemerregistration001mb.custemername = this.f.custemername.value ? this.f.custemername.value : "";
        // custemerregistration001mb.consignee = this.f.consignee.value ? this.f.consignee.value : "";
        custemerregistration001mb.custemercode = this.f.custemercode.value ? this.f.custemercode.value : "";
        custemerregistration001mb.address = this.f.address.value ? this.f.address.value : "";
        // custemerregistration001mb.contact = this.f.contact.value ? this.f.contact.value : "";
        custemerregistration001mb.gstin = this.f.gstin.value ? this.f.gstin.value : "";
        custemerregistration001mb.certification = this.f.certification.value ? this.f.certification.value : "";
        // custemerregistration001mb.nature = this.f.nature.value ? this.f.nature.value : "";
        custemerregistration001mb.productDesc = this.f.productDesc.value ? this.f.productDesc.value : "";
        custemerregistration001mb.reputedCust = this.f.reputedCust.value ? this.f.reputedCust.value : "";
        custemerregistration001mb.concern = this.f.concern.value ? this.f.concern.value : "";
        custemerregistration001mb.otherInfo = this.f.otherInfo.value ? this.f.otherInfo.value : "";
        custemerregistration001mb.website = this.f.website.value ? this.f.website.value : "";
        custemerregistration001mb.customercontact001wbs = this.customercontacts;

        if (this.slNo) {
            custemerregistration001mb.slNo = this.slNo;
            custemerregistration001mb.unitslno = this.unitslno;
            custemerregistration001mb.insertUser = this.insertUser;
            custemerregistration001mb.insertDatetime = this.insertDatetime;
            custemerregistration001mb.updatedUser = this.authManager.getcurrentUser.username;
            custemerregistration001mb.updatedDatetime = new Date();
            this.custmerRegManager.CustmerregUpdate(custemerregistration001mb).subscribe((response) => {
                this.calloutService.showSuccess("Supplier Registration Details Updated Successfully");
                this.loadData();
                this.custemerRegForm.reset();
                this.slNo = null;
                this.submitted = false;
            });
        } else {
            custemerregistration001mb.unitslno= this.user.unitslno;
            custemerregistration001mb.insertUser = this.authManager.getcurrentUser.username;
            custemerregistration001mb.insertDatetime = new Date();
            this.custmerRegManager.CustmerregSave(custemerregistration001mb).subscribe((response) => {
                this.calloutService.showSuccess("Supplier Registration Details Approved Successfully");
                this.loadData();
                this.custemerRegForm.reset();
                this.submitted = false;
            });
        }
    }

    onAddbuttonClick() {
        const modalRef = this.modalService.open(AddCustomerContactComponent, { windowClass: 'my-class' });
        modalRef.componentInstance.customercontacts = this.customercontacts;


        modalRef.componentInstance.custemerRegForm = this.custemerRegForm;
        modalRef.result.then((data) => {
          if (data.status == 'Yes') {
            this.customercontacts = data.customercontacts;
    
          }
        })
      }
    onReset() {
        this.submitted = false;
        this.custemerRegForm.reset();
    }

    onViewButtonClick(params: any) {
        this.custmerRegManager.pdfId(params.data.slNo, this.user.unitslno).subscribe((response) => {
            var blob = new Blob([response], { type: 'application/pdf' });
            var blobURL = URL.createObjectURL(blob);
            window.open(blobURL);
        })

    }

    onPdfButtonClick(params: any) {
        this.custmerRegManager.pdfId(params.data.slNo, this.user.unitslno).subscribe((response) => {
            let date = new Date();
            let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
            saveAs(response, params.data.custemercode + "  " + newDate);
        })

    }
    onEXcelButtonClick(params: any) {
        this.custmerRegManager.ExcelId(params.data.slNo, this.user.unitslno).subscribe((response) => {
            let date = new Date();
            let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
            saveAs(response, params.data.custemercode + "  " + newDate);
        })

    }

    onViewClick() {
        this.custmerRegManager.customerRegPdf(this.user.unitslno).subscribe((response) => {
            var blob = new Blob([response], { type: 'application/pdf' });
            var blobURL = URL.createObjectURL(blob);
            window.open(blobURL);
        })
    }

    onGeneratePdfReport() {
        this.custmerRegManager.customerRegPdf(this.user.unitslno).subscribe((response) => {
            let date = new Date();
            let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
            saveAs(response, "Customer-Registration-Details" + " " + newDate);
        })
    }

    onGenerateExcelReport() {
        this.custmerRegManager.customerRegExcel(this.user.unitslno).subscribe((response) => {
            let date = new Date();
            let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
            saveAs(response, "Customer-Registration-Details" + " " + newDate);
        });
    }



}
