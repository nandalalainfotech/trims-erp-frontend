import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import * as saveAs from 'file-saver';
import { forkJoin } from 'rxjs';
import { deserialize } from 'serializer.ts/Serializer';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { MetriealinwardComponent } from 'src/app/shared/metriealinward/metriealinward.component';
import { RetunStockPopupComponent } from 'src/app/shared/retun-stock-popup/retun-stock-popup.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { ChildPartManager } from 'src/app/shared/services/restcontroller/bizservice/ChildPart.service';
import { ConsumbleManager } from 'src/app/shared/services/restcontroller/bizservice/consumble.service';
import { MaterialInspectionManager } from 'src/app/shared/services/restcontroller/bizservice/Materialinspection.service';
import { MaterialMomentsManager } from 'src/app/shared/services/restcontroller/bizservice/Materialmoments.service';
import { MaterialreceiveditemManager } from 'src/app/shared/services/restcontroller/bizservice/Materialreceiveditem.service';
import { MaterialStockManager } from 'src/app/shared/services/restcontroller/bizservice/materialStock.service';
import { OrderItemSettingManager } from 'src/app/shared/services/restcontroller/bizservice/orderItems.service';
import { PartManager } from 'src/app/shared/services/restcontroller/bizservice/part.service';
import { RawmaterialinspectionManager } from 'src/app/shared/services/restcontroller/bizservice/Rawmaterialinspection.service';
import { ReturnStockManager } from 'src/app/shared/services/restcontroller/bizservice/Returnstock.service';
import { ChildPart001mb } from 'src/app/shared/services/restcontroller/entities/ChildPart001mb';
import { Consumble001mb } from 'src/app/shared/services/restcontroller/entities/Consumble001mb';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { Materialinspection001wb } from 'src/app/shared/services/restcontroller/entities/MaterialInspection001wb';
import { Materialreceiveditem001wb } from 'src/app/shared/services/restcontroller/entities/Materialreceiveditem001wb';
import { Orderitem001mb } from 'src/app/shared/services/restcontroller/entities/Orderitem001mb';
import { Part001mb } from 'src/app/shared/services/restcontroller/entities/Part001mb';
import { Rawmaterialinspection001wb } from 'src/app/shared/services/restcontroller/entities/Rawmaterialinspection001wb';
import { Returnstock001wb } from 'src/app/shared/services/restcontroller/entities/Returnstock001wb';
import { MaterialStock001wb } from 'src/app/shared/services/restcontroller/entities/stock001wb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';

@Component({
  selector: 'app-return-stock',
  templateUrl: './return-stock.component.html',
  styleUrls: ['./return-stock.component.css']
})
export class ReturnStockComponent implements OnInit {

  materialStockForm: FormGroup | any;
  rawMaterialForm: FormGroup | any;

  ReturnForm: FormGroup | any;
  ReturnConumForm: FormGroup | any;
  ReturnChildForm: FormGroup | any;
  ReturnPartForm: FormGroup | any;
  frameworkComponents: any;
  public gridOptions1: GridOptions | any;
  public gridOptions2: GridOptions | any;
  public gridOptions3: GridOptions | any;
  public gridOptions4: GridOptions | any;
  public gridOptions: GridOptions | any;
  public gridOptions5: GridOptions | any;
  public gridOptions6: GridOptions | any;
  public gridOptions7: GridOptions | any;
  public gridOptions8: GridOptions | any;

  submitted = false;
  unitslno: number | any;
  slNo?: number | null;
  date?: Date | null;
  time?: number;
  paidamount?: number;
  dispatch?: string;
  vichleno?: string;
  personname?: string;
  mobilenumber?: number;
  status?: string;
  referenceid?: string;
  ordernumber?: number;
  rejectitems?: number;

  cudate?: Date;
  cutime?: number;
  cupaidamount?: number;
  cudispatch?: string;
  cuvichleno?: string;
  cupersonname?: string;
  cumobilenumber?: number;
  custatus?: string;
  cureferenceid?: string;
  cuordernumber?: number;
  curejectitems?: number;

  cptdate?: Date;
  cpttime?: number;
  cptpaidamount?: number;
  cptdispatch?: string;
  cptvichleno?: string;
  cptpersonname?: string;
  cptmobilenumber?: number;
  cptstatus?: string
  cptreferenceid?: string;
  childpartnumber?: number;
  cptrejectitems?: number;

  prtdate?: Date;
  prttime?: number;
  prtpaidamount?: number;
  prtdispatch?: string;
  prtvichleno?: string;
  prtpersonname?: string;
  prtmobilenumber?: number;
  prtstatus?: string;
  prtreferenceid?: string;
  partnumber?: number;
  prtrejectitems?: number;

  insertUser?: string;
  insertDatetime?: Date;
  updatedUser?: string | null;
  updatedDatetime?: Date | null;
  orderitem001mbs: Orderitem001mb[] = [];
  orderitem001mb?: Orderitem001mb;
  childPart001mbs: ChildPart001mb[] = [];
  childPart001mb?: ChildPart001mb;
  consumble001mbs: Consumble001mb[] = [];
  consumble001mb?: Consumble001mb;
  part001mbs: Part001mb[] = [];
  part001mb?: Part001mb;
  returnstock001wbs: Returnstock001wb[] = [];
  returnstock001wb?: Returnstock001wb;
  rawmaterialinspection001wbs: Rawmaterialinspection001wb[] = [];
  rawmaterialinspection001wb?: Rawmaterialinspection001wb | any;
  RawmeterialItemcodes: Rawmaterialinspection001wb[] = [];
  consumableItemcodes: Rawmaterialinspection001wb[] = [];
  ChildpartItemcodes: Rawmaterialinspection001wb[] = [];
  PartItemCodes: Rawmaterialinspection001wb[] = [];
  rawmetriealcodes: any = [];
  Consumablecodes: any = [];
  ChildPartcodes: any = [];
  Partcodes: any = [];
  rejectitem: any = [];




  user?: Login001mb | any;
  minDate = new Date();
  maxDate = new Date();
  rawmetrieal: Rawmaterialinspection001wb[] = [];
  consumable: Rawmaterialinspection001wb[] = [];
  childpart: Rawmaterialinspection001wb[] = [];
  part: Rawmaterialinspection001wb[] = [];
  rawmetriealcode: any = [];
  ordercode: any = [];
  materialreceiveditem001wbs: Materialreceiveditem001wb[] = [];
  materialreceiveditem001wb?: Materialreceiveditem001wb;
  stocks: MaterialStock001wb[] = [];
  rawmetriealItems: any = [];
  consumableItems: any = [];
  childpartItems: any = [];
  partItems: any = [];

  OrderItems: Returnstock001wb[] = [];
  ConsumableItems: Returnstock001wb[] = [];
  ChilpartItems: Returnstock001wb[] = [];
  PartItems: Returnstock001wb[] = [];
  materialinspection001wbs: Materialinspection001wb[] = [];
  materialinspection001wb?: Materialinspection001wb | any;
  rejected: number | any;
  rawmetriealItemsCodes: any = [];

  constructor(private formBuilder: FormBuilder,
    private authManager: AuthManager,
    private calloutService: CalloutService,
    private modalService: NgbModal,
    private router: Router,
    private materialInspectionManager: MaterialInspectionManager,
    private orderItemSettingManager: OrderItemSettingManager,
    private childPartManager: ChildPartManager,
    private consumbleManager: ConsumbleManager,
    private returnStockManager: ReturnStockManager,
    private materialreceiveditemManager: MaterialreceiveditemManager,
    private materialMomentsManager: MaterialMomentsManager,
    private partManager: PartManager,
    private materialStockManager: MaterialStockManager,
    private rawmaterialinspectionManager: RawmaterialinspectionManager,
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
    this.createDataGrid005();
    this.createDataGrid006();
    this.createDataGrid007();
    this.createDataGrid008();




    this.consumbleManager.allconsumble(this.user.unitslno).subscribe(response => {
      this.consumble001mbs = deserialize<Consumble001mb[]>(Consumble001mb, response);

    });

    this.childPartManager.allChildpart(this.user.unitslno).subscribe(response => {
      this.childPart001mbs = deserialize<ChildPart001mb[]>(ChildPart001mb, response);

    });

    this.partManager.allpart(this.user.unitslno).subscribe(response => {
      this.part001mbs = deserialize<Part001mb[]>(Part001mb, response);

    });

    this.orderItemSettingManager.allitem(this.user.unitslno).subscribe(response => {
      this.orderitem001mbs = deserialize<Orderitem001mb[]>(Orderitem001mb, response);

    });



    let res1 = this.returnStockManager.allStock(this.user.unitslno);
    let res2 = this.rawmaterialinspectionManager.allrawmaterial(this.user.unitslno)
    forkJoin([res1, res2]).subscribe((result: any) => {
      this.returnstock001wbs = deserialize<Returnstock001wb[]>(Returnstock001wb, result[0]);
      this.rawmaterialinspection001wbs = deserialize<Rawmaterialinspection001wb[]>(Rawmaterialinspection001wb, result[1]);
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
      }
      this.rawmetriealcodes = this.rawmetriealcodes.filter((e, i) => this.rawmetriealcodes.findIndex(a => a["itemcode"] === e["itemcode"]) === i);
      this.Consumablecodes = this.Consumablecodes.filter((e, i) => this.Consumablecodes.findIndex(a => a["cucode"] === e["cucode"]) === i);
      this.ChildPartcodes = this.ChildPartcodes.filter((e, i) => this.ChildPartcodes.findIndex(a => a["cptcode"] === e["cptcode"]) === i);
      this.Partcodes = this.Partcodes.filter((e, i) => this.Partcodes.findIndex(a => a["prtcode"] === e["prtcode"]) === i);
      this.loadData();
    });

    this.ReturnForm = this.formBuilder.group({
      date: [this.datepipe.transform(new Date(), 'dd-MM-yyyy')],
      time: ['', Validators.required],
      paidamount: ['', Validators.required],
      dispatch: ['', Validators.required],
      vichleno: ['', Validators.required],
      personname: ['', Validators.required],
      mobilenumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      status: ['', Validators.required],
      referenceid: ['', Validators.required],
      ordernumber: ['', Validators.required],
      rejectitems: ['', Validators.required],

    })


    this.ReturnConumForm = this.formBuilder.group({
      cudate: [this.datepipe.transform(new Date(), 'dd-MM-yyyy')],
      cutime: ['', Validators.required],
      cupaidamount: ['', Validators.required],
      cudispatch: ['', Validators.required],
      cuvichleno: ['', Validators.required],
      cupersonname: ['', Validators.required],
      cumobilenumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      custatus: ['', Validators.required],
      cureferenceid: ['', Validators.required],
      cuordernumber: ['', Validators.required],
      curejectitems: ['', Validators.required],
    })

    this.ReturnChildForm = this.formBuilder.group({

      cptdate: [this.datepipe.transform(new Date(), 'dd-MM-yyyy')],
      cpttime: ['', Validators.required],
      cptpaidamount: ['', Validators.required],
      cptdispatch: ['', Validators.required],
      cptvichleno: ['', Validators.required],
      cptpersonname: ['', Validators.required],
      cptmobilenumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      cptstatus: ['', Validators.required],
      cptreferenceid: ['', Validators.required],
      childpartnumber: ['', Validators.required],
      cptrejectitems: ['', Validators.required],
    })

    this.ReturnPartForm = this.formBuilder.group({

      prtdate: [this.datepipe.transform(new Date(), 'dd-MM-yyyy')],
      prttime: ['', Validators.required],
      prtpaidamount: ['', Validators.required],
      prtdispatch: ['', Validators.required],
      prtvichleno: ['', Validators.required],
      prtpersonname: ['', Validators.required],
      prtmobilenumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      prtstatus: ['', Validators.required],
      prtreferenceid: ['', Validators.required],
      partnumber: ['', Validators.required],
      prtrejectitems: ['', Validators.required],
    })




  }


  get f() { return this.ReturnForm.controls }
  get o() { return this.ReturnConumForm.controls }
  get p() { return this.ReturnChildForm.controls }
  get q() { return this.ReturnPartForm.controls }

  loadData() {
    this.rawmetrieal = [];
    this.consumable = [];
    this.childpart = [];
    this.part = [];
    this.OrderItems=[];
    this.ConsumableItems=[];
    this.ChilpartItems=[];
    this.PartItems=[];
    setTimeout(() => {
      this.returnStockManager.allStock(this.user.unitslno).subscribe(response => {
        this.returnstock001wbs = deserialize<Returnstock001wb[]>(Returnstock001wb, response);
        for (let i = 0; i < this.returnstock001wbs.length; i++) {
          if (this.returnstock001wbs[i].ordernumber) {
            this.OrderItems.push(this.returnstock001wbs[i],)
          }
          if (this.returnstock001wbs[i].cuordernumber) {
            this.ConsumableItems.push(this.returnstock001wbs[i])
          }
          if (this.returnstock001wbs[i].childpartnumber) {
            this.ChilpartItems.push(this.returnstock001wbs[i])
          }
          if (this.returnstock001wbs[i].partnumber) {
            this.PartItems.push(this.returnstock001wbs[i])
          }
        }

        if (this.OrderItems.length > 0) {
          this.gridOptions5?.api?.setRowData(this.OrderItems);
        } else {
          this.gridOptions5?.api?.setRowData([]);
        }
        if (this.ConsumableItems.length > 0) {
          this.gridOptions6?.api?.setRowData(this.ConsumableItems);
        } else {
          this.gridOptions6?.api?.setRowData([]);
        }
        if (this.ChilpartItems.length > 0) {
          this.gridOptions7?.api?.setRowData(this.ChilpartItems);
        } else {
          this.gridOptions7?.api?.setRowData([]);
        }
        if (this.PartItems.length > 0) {
          this.gridOptions8?.api?.setRowData(this.PartItems);
        } else {
          this.gridOptions8?.api?.setRowData([]);
        }
      });

      this.rawmaterialinspectionManager.allrawmaterial(this.user.unitslno).subscribe(response => {
        this.rawmaterialinspection001wbs = deserialize<Rawmaterialinspection001wb[]>(Rawmaterialinspection001wb, response);

        for (let i = 0; i < this.rawmaterialinspection001wbs.length; i++) {
          if (this.rawmaterialinspection001wbs[i].cucode) {
            this.consumable.push(this.rawmaterialinspection001wbs[i],)
          }
          if (this.rawmaterialinspection001wbs[i].itemcode) {
            this.rawmetrieal.push(this.rawmaterialinspection001wbs[i])
          }
          if (this.rawmaterialinspection001wbs[i].cptcode) {
            this.childpart.push(this.rawmaterialinspection001wbs[i])
          }
          if (this.rawmaterialinspection001wbs[i].prtcode) {
            this.part.push(this.rawmaterialinspection001wbs[i])
          }
        }
        this.rawmetrieal = this.rawmetrieal.filter((e, i) => this.rawmetrieal.findIndex(a => a["itemcode"] === e["itemcode"]) === i);
        this.consumable = this.consumable.filter((e, i) => this.consumable.findIndex(a => a["cucode"] === e["cucode"]) === i);
        this.childpart = this.childpart.filter((e, i) => this.childpart.findIndex(a => a["cptcode"] === e["cptcode"]) === i);
        this.part = this.part.filter((e, i) => this.part.findIndex(a => a["prtcode"] === e["prtcode"]) === i);

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
    }, 100);

  }

  createDataGrid001(): void {
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
          onClick: this.itemViewButtonClick.bind(this),
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
          onClick: this.itemPdfButtonClick.bind(this),
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
          onClick: this.itemEXcelButtonClick.bind(this),
          label: 'Excel',
        },
      },
      {
        headerName: 'item Code',
        field: 'itemcode',
        width: 97,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        valueGetter: this.setitemcode.bind(this)

      },
      {
        headerName: 'item Name',
        field: 'itemname',
        width: 120,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
      },
      {
        headerName: 'Description',
        field: 'descrip',
        width: 120,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
      },
      {
        headerName: 'Reject Qty',
        field: 'rejectesum',
        width: 120,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },


    ];
  }

  createDataGrid005(): void {
    this.gridOptions5 = {
      paginationPageSize: 10,
      rowSelection: 'single',
    };
    this.gridOptions5.editType = 'fullRow';
    this.gridOptions5.enableRangeSelection = true;
    this.gridOptions5.animateRows = true;
    this.gridOptions5.columnDefs = [
      {
        headerName: 'Dispatch Date',
        field: 'date',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        valueGetter: (params: any) => {
          return params.data.date ? this.datepipe.transform(params.data.date, 'dd-MM-yyyy') : '';
        }
      },
      {
        headerName: 'Time',
        field: 'time',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        // valueGetter: this.settime.bind(this)
      },
      {
        headerName: 'paid Amount',
        field: 'paidamount',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setAmount.bind(this)
      },
      {
        headerName: 'Mode of Dispatch',
        field: 'dispatch',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setDispatch.bind(this)
      },
      {
        headerName: 'Vichle No',
        field: 'vichleno',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setvichleno.bind(this)
      },
      {
        headerName: 'Person Name',
        field: 'personname',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setpersonname.bind(this)
      },
      {
        headerName: 'Mobile Number',
        field: 'mobilenumber',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setmobilenumber.bind(this)
      },
      {
        headerName: 'Status',
        field: 'status',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setstatus.bind(this)
      },
      {
        headerName: 'Reference id No',
        field: 'referenceid',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setreferenceid.bind(this)
      },
      {
        headerName: 'Reject Qty',
        field: 'rejectitems',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setrejectitems.bind(this)
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

  onApprovedParamsClick(params: any) {
    let Returnitems: any = [];
    if (params.data.itemcode) {
      this.rawmetriealItems.push(params.data)
    }
    if (this.rawmetriealItems.length > 0) {
      Returnitems = "Raw Material";
    }
    const modalRef = this.modalService.open(RetunStockPopupComponent, { windowClass: 'my-class' });
    modalRef.componentInstance.Returnitems = Returnitems;
    modalRef.componentInstance.RawMaterialcode = params.data;
    modalRef.result.then((data) => {
      this.rawmetrieal = [];
      this.consumable = [];
      this.childpart = [];
      this.part = [];
      if (data.status == 'Yes') {
        this.loadData();
      }
    })
  }



  setitemcode(params: any): string {
    return params.data.itemcode2 ? params.data.itemcode2.itemcode : null;
  }

  rowClicked(params: any) {
    params.node.setData({
      ...params.data,
      name: true,
    });
  }

  columnDefs(params) {

  }

  getRowStyle1(params) {
    if (params.data.rejectesum == 0) {
      return { 'background-color': '#DE3163' };
    } else {
      return { 'background-color': '#FFFF00' };
    }
    return true;
  }
  getRowStyle2(params) {
    if (params.data.curejectesum == 0) {
      return { 'background-color': '#DE3163' };
    } else {
      return { 'background-color': '#FFFF00' };
    }
    return true;
  }

  getRowStyle3(params) {
    if (params.data.cptrejectesum == 0) {
      return { 'background-color': '#DE3163' };
    } else {
      return { 'background-color': '#FFFF00' };
    }
    return true;
  }
  getRowStyle4(params) {
    if (params.data.prtrejectesum == 0) {
      return { 'background-color': '#DE3163' };
    } else {
      return { 'background-color': '#FFFF00' };
    }
    return true;
  }


  createDataGrid002(): void {
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
          onClick: this.consumViewButtonClick.bind(this),
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
          onClick: this.consumPdfButtonClick.bind(this),
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
          onClick: this.consumEXcelButtonClick.bind(this),
          label: 'Excel',
        },
      },
      {
        headerName: 'consumable Code',
        field: 'cucode',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: this.setcucode.bind(this)
      },
      {
        headerName: 'consumable Name',
        field: 'cuname',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'consumable Description',
        field: 'cudescrip',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Reject Quantity',
        field: 'curejectesum',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },


    ];
  }
  createDataGrid006(): void {
    this.gridOptions6 = {
      paginationPageSize: 10,
      rowSelection: 'single',
    };
    this.gridOptions6.editType = 'fullRow';
    this.gridOptions6.enableRangeSelection = true;
    this.gridOptions6.animateRows = true;
    this.gridOptions6.columnDefs = [
      {
        headerName: 'Dispatch Date',
        field: 'cudate',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        valueGetter: (params: any) => {
          return params.data.date ? this.datepipe.transform(params.data.date, 'dd-MM-yyyy') : '';
        }
      },
      {
        headerName: 'Time',
        field: 'cutime',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        // valueGetter: this.settime.bind(this)
      },
      {
        headerName: 'paid Amount',
        field: 'cupaidamount',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setAmount.bind(this)
      },
      {
        headerName: 'Mode of Dispatch',
        field: 'cudispatch',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setDispatch.bind(this)
      },
      {
        headerName: 'Vichle No',
        field: 'cuvichleno',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setvichleno.bind(this)
      },
      {
        headerName: 'Person Name',
        field: 'cupersonname',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setpersonname.bind(this)
      },
      {
        headerName: 'Mobile Number',
        field: 'cumobilenumber',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setmobilenumber.bind(this)
      },
      {
        headerName: 'Status',
        field: 'custatus',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setstatus.bind(this)
      },
      {
        headerName: 'Reference id No',
        field: 'cureferenceid',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setreferenceid.bind(this)
      },
      {
        headerName: 'Reject Qty',
        field: 'curejectitems',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setrejectitems.bind(this)
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


  setcucode(params: any): string {
    return params.data.cucode2 ? params.data.cucode2.consmno : null;
  }

  createDataGrid003(): void {
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
          onClick: this.cpartViewButtonClick.bind(this),
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
          onClick: this.cpartPdfButtonClick.bind(this),
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
          onClick: this.cpartEXcelButtonClick.bind(this),
          label: 'Excel',
        },
      },
      {
        headerName: 'Child Part Code',
        field: 'cptcode',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: this.setcptcode.bind(this)
      },
      {
        headerName: 'Child Part Name',
        field: 'cptname',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Child Part Description',
        field: 'cptdescrip',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Reject Quantity',
        field: 'cptrejectesum',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },

    ];
  }

  createDataGrid007(): void {
    this.gridOptions7 = {
      paginationPageSize: 10,
      rowSelection: 'single',
    };
    this.gridOptions7.editType = 'fullRow';
    this.gridOptions7.enableRangeSelection = true;
    this.gridOptions7.animateRows = true;
    this.gridOptions7.columnDefs = [
      {
        headerName: 'Dispatch Date',
        field: 'cptdate',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        valueGetter: (params: any) => {
          return params.data.date ? this.datepipe.transform(params.data.date, 'dd-MM-yyyy') : '';
        }
      },
      {
        headerName: 'Time',
        field: 'cpttime',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        // valueGetter: this.settime.bind(this)
      },
      {
        headerName: 'paid Amount',
        field: 'cptpaidamount',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setAmount.bind(this)
      },
      {
        headerName: 'Mode of Dispatch',
        field: 'cptdispatch',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setDispatch.bind(this)
      },
      {
        headerName: 'Vichle No',
        field: 'cptvichleno',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setvichleno.bind(this)
      },
      {
        headerName: 'Person Name',
        field: 'cptpersonname',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setpersonname.bind(this)
      },
      {
        headerName: 'Mobile Number',
        field: 'cptmobilenumber',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setmobilenumber.bind(this)
      },
      {
        headerName: 'Status',
        field: 'cptstatus',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setstatus.bind(this)
      },
      {
        headerName: 'Reference id No',
        field: 'cptreferenceid',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setreferenceid.bind(this)
      },
      {
        headerName: 'Reject Qty',
        field: 'cptrejectitems',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setrejectitems.bind(this)
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

  setcptcode(params: any): string {
    return params.data.cptcode2 ? params.data.cptcode2.cpartno : null;
  }

  createDataGrid004(): void {
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
          onClick: this.partViewButtonClick.bind(this),
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
          onClick: this.partPdfButtonClick.bind(this),
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
          onClick: this.partEXcelButtonClick.bind(this),
          label: 'Excel',
        },
      },
      {
        headerName: 'Part Code',
        field: 'prtcode',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        valueGetter: this.setprtcode.bind(this)
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
        headerName: 'Part Description',
        field: 'prtdescrip',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Reject Quantity',
        field: 'prtrejectesum',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },


    ];
  }

  createDataGrid008(): void {
    this.gridOptions8 = {
      paginationPageSize: 10,
      rowSelection: 'single',
    };
    this.gridOptions8.editType = 'fullRow';
    this.gridOptions8.enableRangeSelection = true;
    this.gridOptions8.animateRows = true;
    this.gridOptions8.columnDefs = [
      {
        headerName: 'Dispatch Date',
        field: 'prtdate',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        valueGetter: (params: any) => {
          return params.data.date ? this.datepipe.transform(params.data.date, 'dd-MM-yyyy') : '';
        }
      },
      {
        headerName: 'Time',
        field: 'prttime',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        // valueGetter: this.settime.bind(this)
      },
      {
        headerName: 'paid Amount',
        field: 'prtpaidamount',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setAmount.bind(this)
      },
      {
        headerName: 'Mode of Dispatch',
        field: 'prtdispatch',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setDispatch.bind(this)
      },
      {
        headerName: 'Vichle No',
        field: 'prtvichleno',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setvichleno.bind(this)
      },
      {
        headerName: 'Person Name',
        field: 'prtpersonname',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setpersonname.bind(this)
      },
      {
        headerName: 'Mobile Number',
        field: 'prtmobilenumber',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setmobilenumber.bind(this)
      },
      {
        headerName: 'Status',
        field: 'prtstatus',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setstatus.bind(this)
      },
      {
        headerName: 'Reference id No',
        field: 'prtreferenceid',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setreferenceid.bind(this)
      },
      {
        headerName: 'Reject Qty',
        field: 'prtrejectitems',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        // valueGetter: this.setrejectitems.bind(this)
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

  setprtcode(params: any): string {
    return params.data.prtcode2 ? params.data.prtcode2.partno : null;
  }

  onAuditButtonClick(params: any) {
    const modalRef = this.modalService.open(AuditComponent);
    modalRef.componentInstance.title = "Material Stock Record";
    modalRef.componentInstance.details = params.data
  }

  onEditButtonClick(params: any) {
    // this.slNo = params.data.slNo;
    // this.unitslno = params.data.unitslno;
    // this.insertUser = params.data.insertUser;
    // this.insertDatetime = params.data.insertDatetime;
    // this.materialStockForm.patchValue({
    //   'cname': params.data.cname,
    //   'proname': params.data.proname,
    //   'recdate': new Date(params.data.recdate),
    //   'outdate': new Date(params.data.outdate),
    //   'loc': params.data.loc,
    // });
  }




  onDeleteButtonClick(params: any) {
    const modalRef = this.modalService.open(ConformationComponent);
    modalRef.componentInstance.details = "Material Inward Record";
    modalRef.result.then((data) => {
      if (data == "Yes") {
        this.materialStockManager.materialstockDelete(params.data.slNo).subscribe((response) => {
          for (let i = 0; i < this.stocks.length; i++) {
            if (this.stocks[i].slNo == params.data.slNo) {
              this.stocks?.splice(i, 1);
              break;
            }
          }
          const selectedRows = params.api.getSelectedRows();
          params.api.applyTransaction({ remove: selectedRows });
          this.gridOptions.api.deselectAll();
          this.calloutService.showSuccess("Material Stock Record Removed Successfully");
        });
      }
    })
  }

  onApprovedParamsCuClick(params: any) {
    let Returnitems: any = [];
    if (params.data.cucode) {
      this.consumableItems.push(params.data)
    }
    if (this.consumableItems.length > 0) {
      Returnitems = "Consumable Item";
    }
    const modalRef = this.modalService.open(RetunStockPopupComponent, { windowClass: 'my-class' });
    modalRef.componentInstance.Returnitems = Returnitems;
    modalRef.componentInstance.RawMaterialcode = params.data;
    modalRef.result.then((data) => {
      this.rawmetrieal = [];
      this.consumable = [];
      this.childpart = [];
      this.part = [];
      if (data.status == 'Yes') {
        // this.materialreceiveditem = data.materialreceiveditem;
        this.loadData();
      }
    })
  }

  onApprovedParamsCptClick(params: any) {
    let Returnitems: any = [];
    if (params.data.cptcode) {
      this.childpartItems.push(params.data.cptcode)
    }
    if (this.childpartItems.length > 0) {
      Returnitems = "Child Part";
    }
    const modalRef = this.modalService.open(RetunStockPopupComponent, { windowClass: 'my-class' });
    modalRef.componentInstance.Returnitems = Returnitems;
    modalRef.componentInstance.RawMaterialcode = params.data;
    modalRef.result.then((data) => {
      this.rawmetrieal = [];
      this.consumable = [];
      this.childpart = [];
      this.part = [];
      if (data.status == 'Yes') {
        // this.materialreceiveditem = data.materialreceiveditem;
        this.loadData();
      }
    })
  }

  onApprovedParamsPrtClick(params: any) {
    let Returnitems: any = [];
    if (params.data.prtcode) {
      this.partItems.push(params.data.prtcode)
    }

    if (this.partItems.length > 0) {
      Returnitems = "Part";
    }

    const modalRef = this.modalService.open(RetunStockPopupComponent, { windowClass: 'my-class' });
    modalRef.componentInstance.Returnitems = Returnitems;
    modalRef.componentInstance.RawMaterialcode = params.data;
    modalRef.result.then((data) => {
      this.rawmetrieal = [];
      this.consumable = [];
      this.childpart = [];
      this.part = [];
      if (data.status == 'Yes') {
        // this.materialreceiveditem = data.materialreceiveditem;
        this.loadData();
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

  onMaterialmomentsClick(event: any, ReturnForm: any) {
    this.markFormGroupTouched(this.ReturnForm);
    this.submitted = true;
    if (this.ReturnForm.invalid) {
      return;
    }
    let returnstock001wb = new Returnstock001wb();
    returnstock001wb.date = new Date(this.f.date.value);
    returnstock001wb.time = this.f.time.value ? this.f.time.value : null;
    returnstock001wb.paidamount = this.f.paidamount.value ? this.f.paidamount.value : null;
    returnstock001wb.dispatch = this.f.dispatch.value ? this.f.dispatch.value : "";
    returnstock001wb.vichleno = this.f.vichleno.value ? this.f.vichleno.value : "";
    returnstock001wb.personname = this.f.personname.value ? this.f.personname.value : "";
    returnstock001wb.mobilenumber = this.f.mobilenumber.value ? this.f.mobilenumber.value : null;
    returnstock001wb.status = this.f.status.value ? this.f.status.value : "";
    returnstock001wb.referenceid = this.f.referenceid.value ? this.f.referenceid.value : "";
    returnstock001wb.ordernumber = Number(this.f.ordernumber.value) ? Number(this.f.ordernumber.value) : null;
    // returnstock001wb.ordernumber = this.f.ordernumber.value ? this.orderitem001mbs.find(x => x.itemcode === this.f.ordernumber.value)?.slNo : null;
    returnstock001wb.rejectitems = this.f.rejectitems.value ? this.f.rejectitems.value : null;


    if (this.slNo) {
      returnstock001wb.slNo = this.slNo;
      returnstock001wb.unitslno = this.unitslno;
      returnstock001wb.insertUser = this.insertUser;
      returnstock001wb.insertDatetime = this.insertDatetime;
      returnstock001wb.updatedUser = this.authManager.getcurrentUser.username;
      returnstock001wb.updatedDatetime = new Date();
      this.returnStockManager.StockUpdate(returnstock001wb).subscribe((response) => {
        this.calloutService.showSuccess("Return Stock Updated Successfully");
        this.ReturnForm.reset();
        this.loadData();
        this.slNo = null;
        this.submitted = false;
      });
    } else {
      returnstock001wb.date = new Date();
      returnstock001wb.cudate = new Date();
      returnstock001wb.cptdate = new Date();
      returnstock001wb.prtdate = new Date();
      returnstock001wb.unitslno = this.user.unitslno;
      returnstock001wb.insertUser = this.authManager.getcurrentUser.username;
      returnstock001wb.insertDatetime = new Date();
      this.returnStockManager.Stocksave(returnstock001wb).subscribe((response) => {
        this.calloutService.showSuccess("Return Stock Saved Successfully");
        this.ReturnForm.reset();
        this.ReturnForm.patchValue(
          { date: this.datepipe.transform(new Date(), 'dd-MM-yyyy') }
        );
        this.loadData();
        this.submitted = false;
        // this.activeModal.close("Yes");
      });

    }

  }


  onReturnConsumClick(event: any, ReturnConumForm: any) {
    this.markFormGroupTouched(this.ReturnConumForm);
    this.submitted = true;
    if (this.ReturnConumForm.invalid) {
      return;
    }
    let returnstock001wb = new Returnstock001wb();
    returnstock001wb.cudate = new Date(this.o.cudate.value);
    returnstock001wb.cutime = this.o.cutime.value ? this.o.cutime.value : null;
    returnstock001wb.cupaidamount = this.o.cupaidamount.value ? this.o.cupaidamount.value : null;
    returnstock001wb.cudispatch = this.o.cudispatch.value ? this.o.cudispatch.value : "";
    returnstock001wb.cuvichleno = this.o.cuvichleno.value ? this.o.cuvichleno.value : "";
    returnstock001wb.cupersonname = this.o.cupersonname.value ? this.o.cupersonname.value : "";
    returnstock001wb.cumobilenumber = this.o.cumobilenumber.value ? this.o.cumobilenumber.value : null;
    returnstock001wb.custatus = this.o.custatus.value ? this.o.custatus.value : null;
    returnstock001wb.cureferenceid = this.o.cureferenceid.value ? this.o.cureferenceid.value : "";
    returnstock001wb.cuordernumber = this.o.cuordernumber.value ? this.o.cuordernumber.value : null;
    // returnstock001wb.cuordernumber = this.f.cuordernumber.value ? this.consumble001mbs.find(x => x.consmno === this.RawMaterialcode.cucode2.consmno)?.slNo : null;
    returnstock001wb.curejectitems = this.o.curejectitems.value ? this.o.curejectitems.value : null;

    if (this.slNo) {
      returnstock001wb.slNo = this.slNo;
      returnstock001wb.unitslno = this.unitslno;
      returnstock001wb.insertUser = this.insertUser;
      returnstock001wb.insertDatetime = this.insertDatetime;
      returnstock001wb.updatedUser = this.authManager.getcurrentUser.username;
      returnstock001wb.updatedDatetime = new Date();
      this.returnStockManager.StockUpdate(returnstock001wb).subscribe((response) => {
        this.calloutService.showSuccess("Return Stock Updated Successfully");
        this.ReturnConumForm.reset();
        this.loadData();
        this.slNo = null;
        this.submitted = false;
      });
    } else {
      returnstock001wb.date = new Date();
      returnstock001wb.cudate = new Date();
      returnstock001wb.cptdate = new Date();
      returnstock001wb.prtdate = new Date();
      returnstock001wb.unitslno = this.user.unitslno;
      returnstock001wb.insertUser = this.authManager.getcurrentUser.username;
      returnstock001wb.insertDatetime = new Date();
      this.returnStockManager.Stocksave(returnstock001wb).subscribe((response) => {
        this.calloutService.showSuccess("Return Stock Saved Successfully");
        this.ReturnConumForm.reset();
        this.loadData();
        this.ReturnConumForm.patchValue(
          { cudate: this.datepipe.transform(new Date(), 'dd-MM-yyyy') }
        );
        this.submitted = false;
        // this.activeModal.close("Yes");
      });

    }


  }

  onReturnChildClick(event: any, ReturnChildForm: any) {
    this.markFormGroupTouched(this.ReturnChildForm);
    this.submitted = true;
    if (this.ReturnChildForm.invalid) {
      return;
    }
    let returnstock001wb = new Returnstock001wb();
    returnstock001wb.cptdate = new Date(this.p.cptdate.value);
    returnstock001wb.cpttime = this.p.cpttime.value ? this.p.cpttime.value : null;
    returnstock001wb.cptpaidamount = this.p.cptpaidamount.value ? this.p.cptpaidamount.value : null;
    returnstock001wb.cptdispatch = this.p.cptdispatch.value ? this.p.cptdispatch.value : "";
    returnstock001wb.cptvichleno = this.p.cptvichleno.value ? this.p.cptvichleno.value : "";
    returnstock001wb.cptpersonname = this.p.cptpersonname.value ? this.p.cptpersonname.value : "";
    returnstock001wb.cptmobilenumber = this.p.cptmobilenumber.value ? this.p.cptmobilenumber.value : null;
    returnstock001wb.cptstatus = this.p.cptstatus.value ? this.p.cptstatus.value : "";
    returnstock001wb.cptreferenceid = this.p.cptreferenceid.value ? this.p.cptreferenceid.value : "";
    returnstock001wb.childpartnumber = this.p.childpartnumber.value ? this.p.childpartnumber.value : null;
    // returnstock001wb.childpartnumber = this.f.childpartnumber.value ? this.childPart001mbs.find(x => x.cpartno === this.RawMaterialcode.cptcode2.cpartno)?.slNo : null;
    returnstock001wb.cptrejectitems = this.p.cptrejectitems.value ? this.p.cptrejectitems.value : null;

    if (this.slNo) {
      returnstock001wb.slNo = this.slNo;
      returnstock001wb.unitslno = this.unitslno;
      returnstock001wb.insertUser = this.insertUser;
      returnstock001wb.insertDatetime = this.insertDatetime;
      returnstock001wb.updatedUser = this.authManager.getcurrentUser.username;
      returnstock001wb.updatedDatetime = new Date();
      this.returnStockManager.StockUpdate(returnstock001wb).subscribe((response) => {
        this.calloutService.showSuccess("Return Stock Updated Successfully");
        this.ReturnChildForm.reset();
        this.loadData();
        this.slNo = null;
        this.submitted = false;
      });
    } else {
      returnstock001wb.date = new Date();
      returnstock001wb.cudate = new Date();
      returnstock001wb.cptdate = new Date();
      returnstock001wb.prtdate = new Date();
      returnstock001wb.unitslno = this.user.unitslno;
      returnstock001wb.insertUser = this.authManager.getcurrentUser.username;
      returnstock001wb.insertDatetime = new Date();
      this.returnStockManager.Stocksave(returnstock001wb).subscribe((response) => {
        this.calloutService.showSuccess("Return Stock Saved Successfully");
        this.ReturnChildForm.reset();
        this.ReturnChildForm.patchValue(
          { cptdate: this.datepipe.transform(new Date(), 'dd-MM-yyyy') }
        );
        this.loadData();
        this.submitted = false;
        // this.activeModal.close("Yes");
      });

    }

  }



  onReturnPartClick(event: any, ReturnPartForm: any) {
    this.markFormGroupTouched(this.ReturnPartForm);
    this.submitted = true;
    if (this.ReturnPartForm.invalid) {
      return;
    }
    let returnstock001wb = new Returnstock001wb();

    returnstock001wb.prtdate = new Date(this.q.prtdate.value);
    returnstock001wb.prttime = this.q.prttime.value ? this.q.prttime.value : null;
    returnstock001wb.prtpaidamount = this.q.prtpaidamount.value ? this.q.prtpaidamount.value : null;
    returnstock001wb.prtdispatch = this.q.prtdispatch.value ? this.q.prtdispatch.value : "";
    returnstock001wb.prtvichleno = this.q.prtvichleno.value ? this.q.prtvichleno.value : "";
    returnstock001wb.prtpersonname = this.q.prtpersonname.value ? this.q.prtpersonname.value : "";
    returnstock001wb.prtmobilenumber = this.q.prtmobilenumber.value ? this.q.prtmobilenumber.value : null;
    returnstock001wb.prtstatus = this.q.prtstatus.value ? this.q.prtstatus.value : "";
    returnstock001wb.prtreferenceid = this.q.prtreferenceid.value ? this.q.prtreferenceid.value : "";
    returnstock001wb.partnumber = this.q.partnumber.value ? this.q.partnumber.value : null;
    // returnstock001wb.partnumber = this.f.partnumber.value ? this.part001mbs.find(x => x.partno === this.RawMaterialcode.prtcode2.partno)?.slNo : null
    returnstock001wb.prtrejectitems = this.q.prtrejectitems.value ? this.q.prtrejectitems.value : null;

    if (this.slNo) {
      returnstock001wb.slNo = this.slNo;
      returnstock001wb.unitslno = this.unitslno;
      returnstock001wb.insertUser = this.insertUser;
      returnstock001wb.insertDatetime = this.insertDatetime;
      returnstock001wb.updatedUser = this.authManager.getcurrentUser.username;
      returnstock001wb.updatedDatetime = new Date();
      this.returnStockManager.StockUpdate(returnstock001wb).subscribe((response) => {
        this.calloutService.showSuccess("Return Stock Updated Successfully");
        this.ReturnPartForm.reset();
        this.loadData();
        this.slNo = null;
        this.submitted = false;
      });
    } else {
      returnstock001wb.date = new Date();
      returnstock001wb.cudate = new Date();
      returnstock001wb.cptdate = new Date();
      returnstock001wb.prtdate = new Date();
      returnstock001wb.unitslno = this.user.unitslno;
      returnstock001wb.insertUser = this.authManager.getcurrentUser.username;
      returnstock001wb.insertDatetime = new Date();
      this.returnStockManager.Stocksave(returnstock001wb).subscribe((response) => {
        this.calloutService.showSuccess("Return Stock Saved Successfully");
        this.ReturnPartForm.reset();
        this.ReturnPartForm.patchValue(
          { prtdate: this.datepipe.transform(new Date(), 'dd-MM-yyyy') }
        );

        this.loadData();
        this.submitted = false;
        // this.activeModal.close("Yes");
      });

    }

  }

  onReset() {

  }

  onChange(event: any) {
    this.rawmaterialinspectionManager.findOne(event.target.value).subscribe(response => {
      this.rawmaterialinspection001wb = deserialize<Rawmaterialinspection001wb>(Rawmaterialinspection001wb, response);
      this.ReturnForm.patchValue({
        'rejectitems': this.rawmaterialinspection001wb.rejectesum,
      })
    });
  }

  onChangeConsum(event: any) {
    this.rawmaterialinspectionManager.findOne(event.target.value).subscribe(response => {
      this.rawmaterialinspection001wb = deserialize<Rawmaterialinspection001wb>(Rawmaterialinspection001wb, response);
      this.ReturnConumForm.patchValue({
        'curejectitems': this.rawmaterialinspection001wb.curejectesum,
      })
    });

  }

  onChangeChild(event: any) {
    this.rawmaterialinspectionManager.findOne(event.target.value).subscribe(response => {
      this.rawmaterialinspection001wb = deserialize<Rawmaterialinspection001wb>(Rawmaterialinspection001wb, response);
      this.ReturnChildForm.patchValue({
        'cptrejectitems': this.rawmaterialinspection001wb.cptrejectesum,
      })
    });

  }

  onChangePart(event: any) {
    this.rawmaterialinspectionManager.findOne(event.target.value).subscribe(response => {
      this.rawmaterialinspection001wb = deserialize<Rawmaterialinspection001wb>(Rawmaterialinspection001wb, response);
      this.ReturnPartForm.patchValue({
        'prtrejectitems': this.rawmaterialinspection001wb.prtrejectesum,
      })
    });

  }

  // --------------Item-Pdf-----------------

  itemViewButtonClick(params: any) {
    this.returnStockManager.itempdfId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })

  }
  itemPdfButtonClick(params: any) {
    this.returnStockManager.itempdfId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "ReturnStock-Raw-material-Details" + newDate);
    })

  }
  itemEXcelButtonClick(params: any) {
    this.returnStockManager.itemExcelId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "ReturnStock-Raw-material-Details" + newDate);
    })

  }

  // -----------------Consumable-Pdf-----------------
  consumViewButtonClick(params: any) {
    this.returnStockManager.consumpdfId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })

  }
  consumPdfButtonClick(params: any) {
    this.returnStockManager.consumpdfId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "ReturnStock-Consumable-Item-Details" + newDate);
    })

  }
  consumEXcelButtonClick(params: any) {
    this.returnStockManager.consumExcelId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "ReturnStock-Consumable-Item-Details" + newDate);
    })

  }


  // --------------Childpart-Pdf-------------

  cpartViewButtonClick(params: any) {
    this.returnStockManager.cpartpdfId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })

  }
  cpartPdfButtonClick(params: any) {
    this.returnStockManager.cpartpdfId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "ReturnStock-Child-Part-Details" + newDate);
    })

  }
  cpartEXcelButtonClick(params: any) {
    this.returnStockManager.cpartExcelId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "ReturnStock-Child-Part-Details" + newDate);
    })

  }

  //  ---------------------Part-Excel-------------------

  partViewButtonClick(params: any) {
    this.returnStockManager.partpdfId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })

  }
  partPdfButtonClick(params: any) {
    this.returnStockManager.partpdfId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "ReturnStock-Part-Details" + newDate);
    })

  }
  partEXcelButtonClick(params: any) {
    this.returnStockManager.partExcelId(params.data.slNo, this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "ReturnStock-Part-Details" + newDate);
    })

  }

  // item code
  onViewItemClick() {
    this.returnStockManager.itemFullpdfId(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  onGenerateItemPdfReport() {
    this.returnStockManager.itemFullpdfId(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "ReturnStock-Raw-material-Details" + newDate);
    })
  }

  onGenerateItemExcelReport() {
    this.returnStockManager.itemFullExcelId(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "ReturnStock-Raw-material-Details" + newDate);
    })
  }

  // consumable
  onViewConsumerClick() {
    this.returnStockManager.consumFullpdfId(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  onGenerateConsumerPdfReport() {
    this.returnStockManager.consumFullpdfId(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "ReturnStock-Consumable-Item-Details" + newDate);
    })
  }

  onGenerateConsumerExcelReport() {
    this.returnStockManager.consumFullExcelId(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "ReturnStock-Consumable-Item-Details" + newDate);
    })
  }

  // childcode
  onViewchildcodeClick() {
    this.returnStockManager.cpartFullpdfId(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  onGeneratechildcodePdfReport() {
    this.returnStockManager.cpartFullpdfId(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "ReturnStock-Child-Part-Details" + newDate);
    })
  }

  onGeneratechildcodeExcelReport() {
    this.returnStockManager.cpartFullExcelId(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "ReturnStock-Child-Part-Details" + newDate);
    })
  }

  // partcode
  onViewPrtClick() {
    this.returnStockManager.partFullpdfId(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  onGeneratePrtPdfReport() {
    this.returnStockManager.partFullpdfId(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "ReturnStock-Part-Details" + newDate);
    })
  }

  onGeneratePrtExcelReport() {
    this.returnStockManager.partFullExcelId(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newDate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "ReturnStock-Part-Details" + newDate);
    })


  }

}

