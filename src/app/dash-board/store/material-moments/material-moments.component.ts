import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { param } from 'jquery';
import { deserialize } from 'serializer.ts/Serializer';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { MaterialInwardManager } from 'src/app/shared/services/restcontroller/bizservice/Materialinward.service';
import { PurchaseorderManager } from 'src/app/shared/services/restcontroller/bizservice/Purchaseorder.service';
import { Purchaseorder001wb } from 'src/app/shared/services/restcontroller/entities/Purchaseorder001wb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';
import * as saveAs from 'file-saver';
import { OrderAddItemComponent } from 'src/app/shared/order-add-item/order-add-item.component';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { RawmaterialinspectionManager } from 'src/app/shared/services/restcontroller/bizservice/Rawmaterialinspection.service';
import { Rawmaterialinspection001wb } from 'src/app/shared/services/restcontroller/entities/Rawmaterialinspection001wb';
import { OrderItemSettingManager } from 'src/app/shared/services/restcontroller/bizservice/orderItems.service';
import { Orderitem001mb } from 'src/app/shared/services/restcontroller/entities/Orderitem001mb';
import { ChildPartManager } from 'src/app/shared/services/restcontroller/bizservice/ChildPart.service';
import { ConsumbleManager } from 'src/app/shared/services/restcontroller/bizservice/consumble.service';
import { PartManager } from 'src/app/shared/services/restcontroller/bizservice/part.service';
import { ChildPart001mb } from 'src/app/shared/services/restcontroller/entities/ChildPart001mb';
import { Consumble001mb } from 'src/app/shared/services/restcontroller/entities/Consumble001mb';
import { Part001mb } from 'src/app/shared/services/restcontroller/entities/Part001mb';
import { Materialmoments001wb } from 'src/app/shared/services/restcontroller/entities/Materialmoments001wb';
import { Materialinward001wb } from 'src/app/shared/services/restcontroller/entities/Materialinward001wb';
import { MaterialreceiveditemManager } from 'src/app/shared/services/restcontroller/bizservice/Materialreceiveditem.service';
import { Materialreceiveditem001wb } from 'src/app/shared/services/restcontroller/entities/Materialreceiveditem001wb';
import { MaterialMomentsManager } from 'src/app/shared/services/restcontroller/bizservice/Materialmoments.service';

@Component({
  selector: 'app-material-moments',
  templateUrl: './material-moments.component.html',
  styleUrls: ['./material-moments.component.css']
})
export class MaterialMomentsComponent implements OnInit {
  frameworkComponents: any;
  public gridOptions1: GridOptions | any;
  public gridOptions2: GridOptions | any;
  public gridOptions3: GridOptions | any;
  public gridOptions4: GridOptions | any;

  materialmomentsForm: FormGroup | any;
  submitted = false;
  minDate = new Date();
  maxDate = new Date();
  slNo?: number | null;
  itemslno?: number;
  childslno?: number;
  prtslno?: number;
  consumslno?: number;
  date?: string | null;
  cudate?: string | null;
  cptdate?: string | null;
  prtdate?: string | null;
  qunty?: number;
  cuqunty?: number;
  cptqunty?: number;
  prtqunty?: number;
  department?: string;
  cudepartment?: string;
  prtdepartment?: string;
  cptdepartment?: string;
  time?: string;
  cutime?: string;
  cpttime?: string;
  prttime?: string;
  shift?: string;
  cushift?: string;
  cptshift?: string;
  prtshift?: string;
  insertUser?: string;
  insertDatetime?: Date;
  updatedUser?: string | null;
  updatedDatetime?: Date | null;
  orders: Purchaseorder001wb[] = [];
  material: Materialinward001wb[] = [];
  addPopup: any;
  count: any;
  user?: Login001mb | any;
  unitslno: number | any;
  rawmaterialinspection001wbs: Rawmaterialinspection001wb[] = [];
  rawmaterialinspection001wb?: Rawmaterialinspection001wb;
  orderitem001mbs: Orderitem001mb[] = [];
  orderitem001mb?: Orderitem001mb;
  childPart001mbs: ChildPart001mb[] = [];
  childPart001mb?: ChildPart001mb;
  consumble001mbs: Consumble001mb[] = [];
  consumble001mb?: Consumble001mb;
  part001mbs: Part001mb[] = [];
  part001mb?: Part001mb;
  materialmoments001wbs: Materialmoments001wb[] = []
  materialmoments001wb?: Materialmoments001wb;

  rawmetrieal: Materialmoments001wb[] = [];
  consumable: Materialmoments001wb[] = [];
  childpart: Materialmoments001wb[] = [];
  part: Materialmoments001wb[] = [];

  rawmetriealcodes: any = [];
  Consumablecodes: any = [];
  ChildPartcodes: any = [];
  Partcodes: any = [];
  materialreceiveditem001wbs: Materialreceiveditem001wb[] = [];
  materialreceiveditem001wb?: Materialreceiveditem001wb;

  


  constructor(private formBuilder: FormBuilder,
    private authManager: AuthManager,
    private calloutService: CalloutService,
    private modalService: NgbModal,
    private materialMomentsManager: MaterialMomentsManager,
    private purchaseorderManager: PurchaseorderManager,
    private materialInwardManager: MaterialInwardManager,
    private rawmaterialinspectionManager: RawmaterialinspectionManager,
    private orderItemSettingManager: OrderItemSettingManager,
    private childPartManager: ChildPartManager,
    private consumbleManager: ConsumbleManager,
    private materialreceiveditemManager: MaterialreceiveditemManager,
    private partManager: PartManager,
    private datepipe: DatePipe) {
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

    this.orderItemSettingManager.allitem(this.user.unitslno).subscribe(response => {
      this.orderitem001mbs = deserialize<Orderitem001mb[]>(Orderitem001mb, response);

    });

    this.childPartManager.allChildpart(this.user.unitslno).subscribe(response => {
      this.childPart001mbs = deserialize<ChildPart001mb[]>(ChildPart001mb, response);
    });

    this.consumbleManager.allconsumble(this.user.unitslno).subscribe(response => {
      this.consumble001mbs = deserialize<Consumble001mb[]>(Consumble001mb, response);
    });

    this.partManager.allpart(this.user.unitslno).subscribe(response => {
      this.part001mbs = deserialize<Part001mb[]>(Part001mb, response);
    });

    this.rawmaterialinspectionManager.allrawmaterial(this.user.unitslno).subscribe(response => {
      this.rawmaterialinspection001wbs = deserialize<Rawmaterialinspection001wb[]>(Rawmaterialinspection001wb, response);

      for (let i = 0; i < this.rawmaterialinspection001wbs.length; i++) {
        if (this.rawmaterialinspection001wbs[i].itemcode) {
          this.rawmetriealcodes.push(this.rawmaterialinspection001wbs[i])
        }
        if (this.rawmaterialinspection001wbs[i].cucode) {
          this.Consumablecodes.push(this.rawmaterialinspection001wbs[i])
        }
        if (this.rawmaterialinspection001wbs[i].cptcode) {
          this.ChildPartcodes.push(this.rawmaterialinspection001wbs[i])
        }
        if (this.rawmaterialinspection001wbs[i].prtcode) {
          this.Partcodes.push(this.rawmaterialinspection001wbs[i])
        }
        console.log("this.rawmaterialinspection001wbs",this.rawmetriealcodes);
      }
      
    });

    this.purchaseorderManager.allpurchaseorder(this.user.unitslno).subscribe(response => {
      this.orders = deserialize<Purchaseorder001wb[]>(Purchaseorder001wb, response);
    });

   

    this.materialmomentsForm = this.formBuilder.group({
      itemslno: ['', Validators.required],
      childslno: ['', Validators.required],
      prtslno: ['', Validators.required],
      consumslno: ['', Validators.required],
      date: ['', Validators.required],
      cudate: ['', Validators.required],
      cptdate:['', Validators.required],
      prtdate: ['', Validators.required],
      qunty: ['', Validators.required],
      cuqunty: ['', Validators.required],
      cptqunty: ['', Validators.required],
      prtqunty: ['', Validators.required],
      department: ['', Validators.required],
      cudepartment: ['', Validators.required],
      prtdepartment: ['', Validators.required],
      cptdepartment: ['', Validators.required],
      time: ['', Validators.required],
      cutime: ['', Validators.required],
      cpttime: ['', Validators.required],
      prttime: ['', Validators.required],
      shift: ['', Validators.required],
      cushift: ['', Validators.required],
      cptshift: ['', Validators.required],
      prtshift: ['', Validators.required],
    })


  }


  get f() { return this.materialmomentsForm.controls }

  loadData() {
    this.rawmetrieal=[];
    this.consumable=[];
    this.childpart=[];
    this.part=[];
    this.materialMomentsManager.allMaterial(this.user.unitslno).subscribe(response => {
      this.materialmoments001wbs = deserialize<Materialmoments001wb[]>(Materialmoments001wb, response);
      
      for (let i = 0; i < this.materialmoments001wbs.length; i++) {
        if (this.materialmoments001wbs[i].consumslno) {
          this.consumable.push(this.materialmoments001wbs[i])
        }
        if (this.materialmoments001wbs[i].itemslno) {
          this.rawmetrieal.push(this.materialmoments001wbs[i])
        }
        if (this.materialmoments001wbs[i].childslno) {
          this.childpart.push(this.materialmoments001wbs[i])
        }
        if (this.materialmoments001wbs[i].prtslno) {
          this.part.push(this.materialmoments001wbs[i])
        }
      }
      if (this.rawmetrieal.length > 0) {
        this.gridOptions1?.api?.setRowData(this.rawmetrieal);
      } else {
        this.gridOptions1?.api?.setRowData([]);
      }
      if (this.consumable.length > 0) {
        this.gridOptions2?.api?.setRowData(this.consumable);
      } else {
        this.gridOptions2?.api?.setRowData([]);
      }
      if (this.childpart.length > 0) {
        this.gridOptions3?.api?.setRowData(this.childpart);
      } else {
        this.gridOptions3?.api?.setRowData([]);
      }
      if (this.part.length > 0) {
        this.gridOptions4?.api?.setRowData(this.part);
      } else {
        this.gridOptions4?.api?.setRowData([]);
      }
    });
  }
 

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
        headerName: ' Item Code',
        field: 'itemslno',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Issued Qty',
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
          return params.data.date ? this.datepipe.transform(params.data.date, 'dd-MM-yyyy') : '';
        }
      },
      {
        headerName: 'Issued To',
        field: 'department',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        // valueGetter: this.setSupplier.bind(this)
      },
      {
        headerName: 'Shift',
        field: 'shift',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Time',
        field: 'time',
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
        headerName: ' consumable Code',
        field: 'consumslno',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Issued Qty',
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
          return params.data.cudate ? this.datepipe.transform(params.data.cudate, 'dd-MM-yyyy') : '';
        }
      },
      {
        headerName: 'Issued To',
        field: 'cudepartment',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        // valueGetter: this.setSupplier.bind(this)
      },
      {
        headerName: 'Shift',
        field: 'cushift',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Time',
        field: 'cutime',
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
        headerName: ' Child Part Code',
        field: 'childslno',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Issued Qty',
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
          return params.data.cptdate ? this.datepipe.transform(params.data.cptdate, 'dd-MM-yyyy') : '';
        }
      },
      {
        headerName: 'Issued To',
        field: 'cptdepartment',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        // valueGetter: this.setSupplier.bind(this)
      },
      {
        headerName: 'Shift',
        field: 'cptshift',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Time',
        field: 'cpttime',
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
        headerName: ' Part Code',
        field: 'prtslno',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Issued Qty',
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
          return params.data.prtdate ? this.datepipe.transform(params.data.prtdate, 'dd-MM-yyyy') : '';
        }
      },
      {
        headerName: 'Issued To',
        field: 'prtdepartment',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        // valueGetter: this.setSupplier.bind(this)
      },
      {
        headerName: 'Shift',
        field: 'prtshift',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Time',
        field: 'prttime',
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
 
  

  // setSupplier(params: any): string {
  //   return params.data.supfromSlno2 ? params.data.supfromSlno2.supplierFrom : null;
  // }

  onAuditButtonClick(params: any) {
    const modalRef = this.modalService.open(AuditComponent);
    modalRef.componentInstance.title = "Material Inward Record";
    modalRef.componentInstance.details = params.data
  }

  onEditButtonClick(params: any) {
    this.slNo = params.data.slNo;
    this.unitslno = params.data.unitslno;
    this.insertUser = params.data.insertUser;
    this.insertDatetime = params.data.insertDatetime;
    this.materialmomentsForm.patchValue({
      'date': new Date(params.data.date),
      'supfromSlno': params.data.supfromSlno,
      'dcNo': params.data.dcNo,
      'dcDate': new Date(params.data.dcDate),
      'description': params.data.description,
      'advisedQty': params.data.advisedQty,
      'receivedQty': params.data.receivedQty,
      'acceptedQty': params.data.acceptedQty,
      'rejectedQty': params.data.rejectedQty,
    });
  }
  onAddbuttonClick(object: any) {
    const modalRef = this.modalService.open(OrderAddItemComponent, { size: 'lg' });
  }

  onDeleteButtonClick(params: any) {
    const modalRef = this.modalService.open(ConformationComponent);
    modalRef.componentInstance.details = "Material Inward Record";
    modalRef.result.then((data) => {
      if (data == "Yes") {
        this.materialMomentsManager.MaterialDelete(params.data.slNo).subscribe((response) => {
          for (let i = 0; i < this.materialmoments001wbs.length; i++) {
            if (this.materialmoments001wbs[i].slNo == params.data.slNo) {
              this.materialmoments001wbs?.splice(i, 1);
              break;
            }
          }
          const selectedRows = params.api.getSelectedRows();
          params.api.applyTransaction({ remove: selectedRows });
          this.gridOptions1.api.deselectAll();
          this.calloutService.showSuccess("Material Inward Record Removed Successfully");
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

  onMaterialmomentsClick(event: any, materialmomentsForm: any) {

    let materialmoments001wb = new Materialmoments001wb();
    materialmoments001wb.itemslno = this.f.itemslno.value ? this.f.itemslno.value : null;
    materialmoments001wb.childslno = this.f.childslno.value ? this.f.childslno.value : null
    materialmoments001wb.prtslno = this.f.prtslno.value ? this.f.prtslno.value : null
    materialmoments001wb.consumslno = this.f.consumslno.value ? this.f.consumslno.value : null
    materialmoments001wb.date = new Date(this.f.date.value);
    materialmoments001wb.cudate = new Date(this.f.cudate.value);
    materialmoments001wb.cptdate = new Date(this.f.cptdate.value);
    materialmoments001wb.prtdate = new Date(this.f.prtdate.value);
    materialmoments001wb.department = this.f.department.value ? this.f.department.value : null;
    materialmoments001wb.cudepartment = this.f.cudepartment.value ? this.f.cudepartment.value :null;
    materialmoments001wb.cptdepartment = this.f.cptdepartment.value ? this.f.cptdepartment.value : null;
    materialmoments001wb.prtdepartment = this.f.prtdepartment.value ? this.f.prtdepartment.value :null;
    materialmoments001wb.qunty = this.f.qunty.value ? this.f.qunty.value : null;
    materialmoments001wb.cuqunty = this.f.cuqunty.value ? this.f.cuqunty.value : null;
    materialmoments001wb.cptqunty = this.f.cptqunty.value ? this.f.cptqunty.value : null;
    materialmoments001wb.prtqunty = this.f.prtqunty.value ? this.f.prtqunty.value : null;
    materialmoments001wb.time = this.f.time.value ? this.f.time.value : null;
    materialmoments001wb.cutime = this.f.cutime.value ? this.f.cutime.value : null;
    materialmoments001wb.prttime = this.f.prttime.value ? this.f.prttime.value : null;
    materialmoments001wb.cpttime = this.f.cpttime.value ? this.f.cpttime.value : null;
    materialmoments001wb.shift = this.f.shift.value ? this.f.shift.value : null;
    materialmoments001wb.prtshift = this.f.prtshift.value ? this.f.prtshift.value : null;
    materialmoments001wb.cushift = this.f.cushift.value ? this.f.cushift.value : null;
    materialmoments001wb.cptshift = this.f.cptshift.value ? this.f.cptshift.value : null;

    if (this.slNo) {
      materialmoments001wb.slNo = this.slNo;
      materialmoments001wb.unitslno = this.unitslno;
      materialmoments001wb.insertUser = this.insertUser;
      materialmoments001wb.insertDatetime = this.insertDatetime;
      materialmoments001wb.updatedUser = this.authManager.getcurrentUser.username;
      materialmoments001wb.updatedDatetime = new Date();
      this.materialMomentsManager.MaterialUpdate(materialmoments001wb).subscribe((response) => {
        this.calloutService.showSuccess("Material Momentes Record Updated Successfully");
        this.materialmomentsForm.reset();
        this.loadData();
        this.slNo = null;
        this.submitted = false;
      });
    } else {
      materialmoments001wb.date = new Date();
      materialmoments001wb.cudate = new Date();
      materialmoments001wb.cptdate = new Date();
      materialmoments001wb.prtdate = new Date();
      materialmoments001wb.unitslno = this.user.unitslno;
      materialmoments001wb.insertUser = this.authManager.getcurrentUser.username;
      materialmoments001wb.insertDatetime = new Date();
      this.materialMomentsManager.Materialsave(materialmoments001wb).subscribe((response) => {
        this.calloutService.showSuccess("Material Momentes Record Saved Successfully");
        this.materialmomentsForm.reset();
        this.loadData();
        this.submitted = false;
      });
    }
  }

  onReset() {
    this.submitted = false;
    this.materialmomentsForm.reset();
  }


  itemViewClick() {
    this.materialMomentsManager.itemPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  itemPdfReport() {
    this.materialMomentsManager.itemPdf(this.user.unitslno).subscribe((response) => {
      let date= new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');  
      saveAs(response, "Material-Moments-Item-Details"+ newdate);
    })
  }

  itemExcelReport() {
    this.materialMomentsManager.iemExcel(this.user.unitslno).subscribe((response) => {
      let date= new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');  
      saveAs(response, "Material-Moments-Item-Details" + newdate);
    });
  }

// ------------consumablePdf-----------------

 consumableViewClick() {
    this.materialMomentsManager.consumablePdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  consumablePdfReport() {
    this.materialMomentsManager.consumablePdf(this.user.unitslno).subscribe((response) => {
      let date= new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');  
      saveAs(response, "Material-Moments-ConsumableItem-Details"+ newdate);
    })
  }

  consumableExcelReport() {
    this.materialMomentsManager.consumableExcel(this.user.unitslno).subscribe((response) => {
      let date= new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');  
      saveAs(response, "Material-Moments-ConsumableItem-Details" + newdate);
    });
  }

// ------Childpart----------------

  childPartViewClick() {
    this.materialMomentsManager.childPartPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  childPartPdfReport() {
    this.materialMomentsManager.childPartPdf(this.user.unitslno).subscribe((response) => {
      let date= new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');  
      saveAs(response, "Material-Moments-ChildPart-Details"+ newdate);
    })
  }

  childPartExcelReport() {
    this.materialMomentsManager.childPartExcel(this.user.unitslno).subscribe((response) => {
      let date= new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');  
      saveAs(response, "Material-Moments-ChildPart-Details" + newdate);
    });
  }

  // ------Part----------

  partViewClick() {
    this.materialMomentsManager.PartPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  partPdfReport() {
    this.materialMomentsManager.PartPdf(this.user.unitslno).subscribe((response) => {
      let date= new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');  
      saveAs(response, "Material-Moments-Part-Details"+ newdate);
    })
  }

  partExcelReport() {
    this.materialMomentsManager.PartExcel(this.user.unitslno).subscribe((response) => {
      let date= new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');  
      saveAs(response, "Material-Moments-Part-Details" + newdate);
    });
  }


}
