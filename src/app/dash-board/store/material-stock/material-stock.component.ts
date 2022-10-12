import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import * as saveAs from 'file-saver';
import { forkJoin } from 'rxjs';
import { deserialize } from 'serializer.ts/Serializer';
import { AuditComponent } from 'src/app/shared/audit/audit.component';
import { ConformationComponent } from 'src/app/shared/conformation/conformation.component';
import { MateriealrequestItemComponent } from 'src/app/shared/materiealrequest-item/materiealrequest-item.component';
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
import { ChildPart001mb } from 'src/app/shared/services/restcontroller/entities/ChildPart001mb';
import { Consumble001mb } from 'src/app/shared/services/restcontroller/entities/Consumble001mb';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { Materialinspection001wb } from 'src/app/shared/services/restcontroller/entities/MaterialInspection001wb';
import { Materialreceiveditem001wb } from 'src/app/shared/services/restcontroller/entities/Materialreceiveditem001wb';
import { Orderitem001mb } from 'src/app/shared/services/restcontroller/entities/Orderitem001mb';
import { Part001mb } from 'src/app/shared/services/restcontroller/entities/Part001mb';
import { Rawmaterialinspection001wb } from 'src/app/shared/services/restcontroller/entities/Rawmaterialinspection001wb';
import { MaterialStock001wb } from 'src/app/shared/services/restcontroller/entities/stock001wb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';

@Component({
  selector: 'app-material-stock',
  templateUrl: './material-stock.component.html',
  styleUrls: ['./material-stock.component.css']
})
export class MaterialStockComponent implements OnInit {

  frameworkComponents: any;
  public gridOptions1: GridOptions | any;
  public gridOptions2: GridOptions | any;
  public gridOptions3: GridOptions | any;
  public gridOptions4: GridOptions | any;
  public gridOptions: GridOptions | any;

  materialStockForm: FormGroup | any;
  submitted = false;
  slNo?: number | any;
  cname?: string;
  proname?: string;
  recdate?: Date;
  outdate?: string;
  loc?: string;
  minDate = new Date();
  maxDate = new Date();
  insertUser?: string;
  insertDatetime?: Date;
  updatedUser?: string | null;
  updatedDatetime?: Date | null;
  itemcode2?: Orderitem001mb | any;
  stocks: MaterialStock001wb[] = [];
  user?: Login001mb | any;
  unitslno: number | any;
  orderitem001mbs: Orderitem001mb[] = [];
  orderitem001mb?: Orderitem001mb;
  childPart001mbs: ChildPart001mb[] = [];
  childPart001mb?: ChildPart001mb;
  consumble001mbs: Consumble001mb[] = [];
  consumble001mb?: Consumble001mb;
  part001mbs: Part001mb[] = [];
  part001mb?: Part001mb;
  rawmaterialinspection001wbs: Rawmaterialinspection001wb[] = [];
  rawmetrieal: Rawmaterialinspection001wb[] = [];
  consumable: Rawmaterialinspection001wb[] = [];
  childpart: Rawmaterialinspection001wb[] = [];
  part: Rawmaterialinspection001wb[] = [];
  rawmaterialinspection001wb?: Rawmaterialinspection001wb;
  rawmetriealcode: any = [];
  ordercode: any = [];
  materialreceiveditem001wbs: Materialreceiveditem001wb[] = [];
  materialreceiveditem001wb?: Materialreceiveditem001wb;
  rawmetriealItems: any = [];
  consumableItems: any = [];
  childpartItems: any = [];
  partItems: any = [];
  inspections: Materialinspection001wb[] = [];


  constructor(private formBuilder: FormBuilder,
    private authManager: AuthManager,
    private calloutService: CalloutService,
    private modalService: NgbModal,
    private router: Router,
    private orderItemSettingManager: OrderItemSettingManager,
    private childPartManager: ChildPartManager,
    private consumbleManager: ConsumbleManager,
    private materialreceiveditemManager: MaterialreceiveditemManager,
    private materialMomentsManager: MaterialMomentsManager,
    private partManager: PartManager,
    private materialStockManager: MaterialStockManager,
    private materialInspectionManager: MaterialInspectionManager,
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

    let res0 = this.rawmaterialinspectionManager.allrawmaterial(this.user.unitslno);
    let res1 = this.consumbleManager.allconsumble(this.user.unitslno)
    let res2 = this.childPartManager.allChildpart(this.user.unitslno);
    let res3 = this.partManager.allpart(this.user.unitslno);
    let res4 = this.orderItemSettingManager.allitem(this.user.unitslno);
    let res5 = this.materialInspectionManager.materialinspectionfindall(this.user.unitslno);
    forkJoin([res0, res1, res2, res3, res4, res5]).subscribe((data: any) => {
      this.rawmaterialinspection001wbs = deserialize<Rawmaterialinspection001wb[]>(Rawmaterialinspection001wb, data[0]);
      this.consumble001mbs = deserialize<Consumble001mb[]>(Consumble001mb, data[1]);
      this.part001mbs = deserialize<Part001mb[]>(Part001mb, data[2]);
      this.childPart001mbs = deserialize<ChildPart001mb[]>(ChildPart001mb, data[3]);
      this.orderitem001mbs = deserialize<Orderitem001mb[]>(Orderitem001mb, data[4]);
      this.inspections = deserialize<Materialinspection001wb[]>(Materialinspection001wb, data[5]);

      this.loadData();
    });

  }


  get f() { return this.materialStockForm.controls }

  loadData() {
    this.rawmaterialinspectionManager.allrawmaterial(this.user.unitslno).subscribe(response => {
      this.rawmaterialinspection001wbs = deserialize<Rawmaterialinspection001wb[]>(Rawmaterialinspection001wb, response);
      for (let i = 0; i < this.rawmaterialinspection001wbs.length; i++) {
        if (this.rawmaterialinspection001wbs[i].cucode) {
          this.consumable.push(this.rawmaterialinspection001wbs[i])
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
    };
    this.gridOptions1.editType = 'fullRow';
    this.gridOptions1.enableRangeSelection = true;
    this.gridOptions1.animateRows = true;
    this.gridOptions1.columnDefs = [
      {
        headerName: 'Incoming No',
        // field: 'itemcode',
        width: 97,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        valueGetter: this.setincoming.bind(this)

      },
      {
        headerName: 'Item Code',
        field: 'itemcode',
        width: 97,
        flex: 1,
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
        flex: 1,
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
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
      },
      {
        headerName: 'Accepted Date',
        // field: 'insertDatetime',
        width: 100,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        valueGetter: this.setincomingDate.bind(this)
      },
      {
        headerName: 'Accepted Qty',
        field: 'acceptedQty',
        width: 120,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        // cellStyle: (params: { data: { acceptedQty: number, itemcode2: { mslevel: number } } }) => {
        //   if (params.data.acceptedQty <= params.data.itemcode2.mslevel) {
        //     return { background: '#FF8C00' };
        //   } else if (params.data.acceptedQty >= params.data.itemcode2.mslevel) {
        //     return { background: '#0000FF' };
        //   }
        //   return null;
        // },
      },
      // {
      //   headerName: 'Edit',
      //   cellRenderer: 'iconRenderer',
      //   width: 80,
      // flex: 1,
      //   suppressSizeToFit: true,
      //   cellStyle: { textAlign: 'center' },
      //   cellRendererParams: {
      //     onClick: this.onEditButtonClick.bind(this),
      //     label: 'Edit'
      //   },
      // },

      // {
      //   headerName: 'Delete',
      //   cellRenderer: 'iconRenderer',
      //   width: 85,
      // flex: 1,
      //   suppressSizeToFit: true,
      //   cellStyle: { textAlign: 'center' },
      //   cellRendererParams: {
      //     onClick: this.onDeleteButtonClick.bind(this),
      //     label: 'Delete'
      //   },
      // },
      {
        headerName: 'Audit',
        cellRenderer: 'iconRenderer',
        width: 80,
        flex: 1,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        cellRendererParams: {
          onClick: this.onAuditButtonClick.bind(this),
          label: 'Audit'
        },
      },

    ];
  }

  setincomingDate(params: any): string {
    let datas = this.inspections.find(x => x.slNo == params.data.rawmaterialslno)?.cdate;
    return datas
  }
  setincoming(params: any): string {
    let incoming = this.inspections.find(x => x.slNo == params.data.rawmaterialslno)?.iirno;
    return incoming
  }

  setitemcode(params: any): string {
    return params.data.itemcode2 ? params.data.itemcode2.itemcode : null;
  }
  setlocation(params: any): string {
    return params.data.itemcode ? this.orderitem001mbs.find(x => x.slNo === params.data.itemcode)?.location : null;
  }
  setMSLevel(params: any): string {
    return params.data.itemcode ? this.orderitem001mbs.find(x => x.slNo === params.data.itemcode)?.mslevel : null;
  }
  setleadtime(params: any): string {
    return params.data.itemcode ? this.orderitem001mbs.find(x => x.slNo === params.data.itemcode)?.leadtime : null;
  }
  setorderlevel(params: any): string {
    return params.data.itemcode ? this.orderitem001mbs.find(x => x.slNo === params.data.itemcode)?.orderlevel : null;
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

    // if (params.data.acceptedQty < 50) {
    //   return { 'background-color': '#FF8C00' };
    // } else if (params.data.status == 'Partially Approved') {
    //   return { 'background-color': '#FFFF00' };
    // } else if (params.data.status == 'Hold') {
    //   return { 'background-color': 'lightblue' };
    // } else if (params.data.status == 'Reject') {
    //   return { 'background-color': '#ff8080' };
    // }
    // return true;
  }
  getRowStyle(params) {


    // if (params.data.acceptedQty < 50) {
    //   return { 'background-color': '#FF8C00' };
    // } else if (params.data.status == 'Partially Approved') {
    //   return { 'background-color': '#FFFF00' };
    // } else if (params.data.status == 'Hold') {
    //   return { 'background-color': 'lightblue' };
    // } else if (params.data.status == 'Reject') {
    //   return { 'background-color': '#ff8080' };
    // }
    // return true;
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
        headerName: 'Incoming No',
        // field: 'itemcode',
        width: 97,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        valueGetter: this.setcuincoming.bind(this)

      },
      {
        headerName: 'consumable Code',
        field: 'cucode',
        width: 200,
        flex: 1,
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
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'consumable Description',
        field: 'cudescrip',
        width: 200,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Accepted Date',
        field: 'insertDatetime',
        width: 100,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        valueGetter: this.setincomingcuDate.bind(this)
      },
      {
        headerName: 'Accepted Quantity',
        field: 'cuacceptedQty',
        width: 200,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        // cellStyle: (params: { data: { cuacceptedQty: number, cucode2: { mslevel: number } } }) => {
        //   if (params.data.cuacceptedQty <= params.data.cucode2.mslevel) {
        //     return { background: '#FF8C00' };
        //   }  else if (params.data.cuacceptedQty >= params.data.cucode2.mslevel) {
        //     return { background: '#0000FF' };
        //   }
        //   return null;
        // },
      },
      // {
      //   headerName: 'Edit',
      //   cellRenderer: 'iconRenderer',
      //   width: 80,
      // flex: 1,
      //   suppressSizeToFit: true,
      //   cellStyle: { textAlign: 'center' },
      //   cellRendererParams: {
      //     onClick: this.onEditButtonClick.bind(this),
      //     label: 'Edit'
      //   },
      // },
      // {
      //   headerName: 'Delete',
      //   cellRenderer: 'iconRenderer',
      //   width: 85,
      // flex: 1,
      //   suppressSizeToFit: true,
      //   cellStyle: { textAlign: 'center' },
      //   cellRendererParams: {
      //     onClick: this.onDeleteButtonClick.bind(this),
      //     label: 'Delete'
      //   },
      // },
      {
        headerName: 'Audit',
        cellRenderer: 'iconRenderer',
        width: 80,
        flex: 1,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        cellRendererParams: {
          onClick: this.onAuditButtonClick.bind(this),
          label: 'Audit'
        },
      },

    ];
  }

  setincomingcuDate(params: any): string {
    let datas = this.inspections.find(x => x.slNo == params.data.rawmaterialslno)?.cdate;
    return datas
  }
  setcuincoming(params: any): string {
    let incoming = this.inspections.find(x => x.slNo == params.data.rawmaterialslno)?.iirno;
    return incoming
  }

  setcucode(params: any): string {
    return params.data.cucode2 ? params.data.cucode2.consmno : null;
  }
  setculocation(params: any): string {
    return params.data.cucode2 ? params.data.cucode2.location : null;
  }
  setcuMSLevel(params: any): string {
    return params.data.cucode2 ? params.data.cucode2.mslevel : null;
  }
  setculeadtime(params: any): string {
    return params.data.cucode2 ? params.data.cucode2.leadtime : null;
  }
  setcuorderlevel(params: any): string {
    return params.data.cucode2 ? params.data.cucode2.orderlevel : null;
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
        headerName: 'Incoming No',
        // field: 'itemcode',
        width: 97,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        valueGetter: this.setcptincoming.bind(this)

      },
      {
        headerName: 'Child Part Code',
        field: 'cptcode',
        width: 200,
        flex: 1,
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
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Child Part Description',
        field: 'cptdescrip',
        width: 200,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Accepted Date',
        field: 'insertDatetime',
        width: 100,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        valueGetter: this.setcptincomingDate.bind(this)

      },
      {
        headerName: 'Child Part Quantity',
        field: 'cptacceptedQty',
        width: 200,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      // {
      //   headerName: 'Edit',
      //   cellRenderer: 'iconRenderer',
      //   width: 80,
      // flex: 1,
      //   suppressSizeToFit: true,
      //   cellStyle: { textAlign: 'center' },
      //   cellRendererParams: {
      //     onClick: this.onEditButtonClick.bind(this),
      //     label: 'Edit'
      //   },
      // },
      // {
      //   headerName: 'Delete',
      //   cellRenderer: 'iconRenderer',
      //   width: 85,
      // flex: 1,
      //   suppressSizeToFit: true,
      //   cellStyle: { textAlign: 'center' },
      //   cellRendererParams: {
      //     onClick: this.onDeleteButtonClick.bind(this),
      //     label: 'Delete'
      //   },
      // },
      {
        headerName: 'Audit',
        cellRenderer: 'iconRenderer',
        width: 80,
        flex: 1,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        cellRendererParams: {
          onClick: this.onAuditButtonClick.bind(this),
          label: 'Audit'
        },
      },

    ];
  }


  setcptincomingDate(params: any): string {
    let datas = this.inspections.find(x => x.slNo == params.data.rawmaterialslno)?.cdate;
    return datas
  }
  setcptincoming(params: any): string {
    let incoming = this.inspections.find(x => x.slNo == params.data.rawmaterialslno)?.iirno;
    return incoming
  }

  setcptcode(params: any): string {
    return params.data.cptcode2 ? params.data.cptcode2.cpartno : null;
  }
  setcptlocation(params: any): string {
    return params.data.cptcode2 ? params.data.cptcode2.location : null;
  }
  setcptMSLevel(params: any): string {
    return params.data.cptcode2 ? params.data.cptcode2.mslevel : null;
  }
  setcptleadtime(params: any): string {
    return params.data.cptcode2 ? params.data.cptcode2.leadtime : null;
  }
  setcptorderlevel(params: any): string {
    return params.data.cptcode2 ? params.data.cptcode2.orderlevel : null;
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
        headerName: 'Incoming No',
        // field: 'itemcode',
        width: 97,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        valueGetter: this.setprtincoming.bind(this)

      },
      {
        headerName: 'Part Code',
        field: 'prtcode',
        width: 200,
        flex: 1,
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
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Part Description',
        field: 'prtdescrip',
        width: 200,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Accepted Date',
        field: 'insertDatetime',
        width: 100,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        valueGetter: this.setprtincomingDate.bind(this)
      },
      {
        headerName: 'Recived Quantity',
        field: 'prtacceptedQty',
        width: 200,
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        // cellStyle: (params: { data: { prtacceptedQty: number, prtcode2: { mslevel: number } } }) => {
        //   if (params.data.prtacceptedQty < params.data.prtcode2.mslevel) {
        //     return { background: '#FF8C00' };
        //   } else if (params.data.prtacceptedQty >= params.data.prtcode2.mslevel) {
        //     return { background: '#0000FF' };
        //   }
        //   return null;
        // },
      },

      // {
      //   headerName: 'Edit',
      //   cellRenderer: 'iconRenderer',
      //   width: 80,
      // flex: 1,
      //   suppressSizeToFit: true,
      //   cellStyle: { textAlign: 'center' },
      //   cellRendererParams: {
      //     onClick: this.onEditButtonClick.bind(this),
      //     label: 'Edit'
      //   },
      // },
      // {
      //   headerName: 'Delete',
      //   cellRenderer: 'iconRenderer',
      //   width: 85,
      // flex: 1,
      //   suppressSizeToFit: true,
      //   cellStyle: { textAlign: 'center' },
      //   cellRendererParams: {
      //     onClick: this.onDeleteButtonClick.bind(this),
      //     label: 'Delete'
      //   },
      // },
      {
        headerName: 'Audit',
        cellRenderer: 'iconRenderer',
        width: 80,
        flex: 1,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        cellRendererParams: {
          onClick: this.onAuditButtonClick.bind(this),
          label: 'Audit'
        },
      },

    ];
  }

  setprtincomingDate(params: any): string {
    let datas = this.inspections.find(x => x.slNo == params.data.rawmaterialslno)?.cdate;
    return datas
  }
  setprtincoming(params: any): string {
    let incoming = this.inspections.find(x => x.slNo == params.data.rawmaterialslno)?.iirno;
    return incoming
  }

  setprtcode(params: any): string {
    return params.data.prtcode2 ? params.data.prtcode2.partno : null;
  }
  setprtlocation(params: any): string {
    return params.data.prtcode2 ? params.data.prtcode2.location : null;
  }
  setprtMSLevel(params: any): string {
    return params.data.prtcode2 ? params.data.prtcode2.mslevel : null;
  }
  setprtleadtime(params: any): string {
    return params.data.prtcode2 ? params.data.prtcode2.leadtime : null;
  }
  setprtorderlevel(params: any): string {
    return params.data.prtcode2 ? params.data.prtcode2.orderlevel : null;
  }


  onAuditButtonClick(params: any) {
    const modalRef = this.modalService.open(AuditComponent);
    modalRef.componentInstance.title = "Material Stock Record";
    modalRef.componentInstance.details = params.data
  }

  onEditButtonClick(params: any) {
    this.slNo = params.data.slNo;
    this.unitslno = params.data.unitslno;
    this.insertUser = params.data.insertUser;
    this.insertDatetime = params.data.insertDatetime;
    this.materialStockForm.patchValue({
      'cname': params.data.cname,
      'proname': params.data.proname,
      'recdate': new Date(params.data.recdate),
      'outdate': new Date(params.data.outdate),
      'loc': params.data.loc,
    });
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

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onMaterialStockClick(event: any, materialStockForm: any) {
    this.markFormGroupTouched(this.materialStockForm);
    this.submitted = true;
    if (this.materialStockForm.invalid) {
      return;
    }

    let materialStock001wb = new MaterialStock001wb();
    materialStock001wb.cname = this.f.cname.value ? this.f.cname.value : "";
    materialStock001wb.recdate = new Date(this.f.recdate.value);
    materialStock001wb.proname = this.f.proname.value ? this.f.proname.value : "";
    materialStock001wb.outdate = this.f.outdate.value ? this.f.outdate.value : "";
    materialStock001wb.loc = this.f.loc.value ? this.f.loc.value : "";
    if (this.slNo) {
      materialStock001wb.slNo = this.slNo;
      materialStock001wb.unitslno = this.unitslno;
      materialStock001wb.insertUser = this.insertUser;
      materialStock001wb.insertDatetime = this.insertDatetime;
      materialStock001wb.updatedUser = this.authManager.getcurrentUser.username;
      materialStock001wb.updatedDatetime = new Date();
      this.materialStockManager.materialstockUpdate(materialStock001wb).subscribe((response) => {
        this.calloutService.showSuccess("Material Inward Record Updated Successfully");
        this.materialStockForm.reset();
        this.loadData();
        this.slNo = null;
        this.submitted = false;
      });
    } else {
      // materialinward001wb.date = new Date();
      // materialinward001wb.dcDate = new Date();
      materialStock001wb.unitslno = this.user.unitslno;
      materialStock001wb.insertUser = this.authManager.getcurrentUser.username;
      materialStock001wb.insertDatetime = new Date();
      this.materialStockManager.materialstockSave(materialStock001wb).subscribe((response) => {
        this.calloutService.showSuccess("Material Inward Record Saved Successfully");
        this.materialStockForm.reset();
        this.loadData();
        this.submitted = false;
      });
    }
  }

  onReset() {
    this.submitted = false;
    this.materialStockForm.reset();
  }



  // onViewClick() {
  //   this.materialStockManager.materialstockPdf(this.unitslno).subscribe((response) => {
  //     var blob = new Blob([response], { type: 'application/pdf' });
  //     var blobURL = URL.createObjectURL(blob);
  //     window.open(blobURL);
  //   })
  // }

  // onGeneratePdfReport() {
  //   this.materialStockManager.materialstockPdf(this.unitslno).subscribe((response) => {
  //     saveAs(response, "Material_Inward_Details");
  //   })
  // }

  // onGenerateExcelReport() {
  //   this.materialStockManager.materialstockExcel(this.unitslno).subscribe((response) => {
  //     saveAs(response, "Material_Inward_Details");
  //   });
  // }

  onRawClick() {
    this.router.navigate(["/app-dash-board/app-store/app-return-stock"]);
  }
  onConsumableClick() {
    this.router.navigate(["/app-dash-board/app-store/app-return-stock"]);
  }
  onChildClick() {
    this.router.navigate(["/app-dash-board/app-store/app-return-stock"]);
  }
  onPartClick() {
    this.router.navigate(["/app-dash-board/app-store/app-return-stock"]);
  }

  onApprovedParamsClick(params: any) {
    let Returnitems: any = [];
    if (params.data.itemcode) {
      this.rawmetriealItems.push(params.data)
    }
    if (this.rawmetriealItems.length > 0) {
      Returnitems = "Raw Material";
    }
    const modalRef = this.modalService.open(MateriealrequestItemComponent, { windowClass: 'my-class' });
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


  itemViewClick() {
    this.rawmaterialinspectionManager.itemStockPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  itemPdfReport() {
    this.rawmaterialinspectionManager.itemStockPdf(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Stock-Inward-Details" + newdate);
    })
  }

  itemExcelReport() {
    this.rawmaterialinspectionManager.itemStockExcel(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Stock-Inward-Details" + newdate);
    });
  }

  // ------------consumablePdf-----------------

  consumableViewClick() {
    this.rawmaterialinspectionManager.consumableStockPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  consumablePdfReport() {
    this.rawmaterialinspectionManager.consumableStockPdf(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Stock-Inward-Details" + newdate);
    })
  }

  consumableExcelReport() {
    this.rawmaterialinspectionManager.consumableStockExcel(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Stock-Inward-Details" + newdate);
    });
  }

  // ------Childpart----------------

  childPartViewClick() {
    this.rawmaterialinspectionManager.childPartStockPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  childPartPdfReport() {
    this.rawmaterialinspectionManager.childPartStockPdf(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Stock-Inward-Details" + newdate);
    })
  }

  childPartExcelReport() {
    this.rawmaterialinspectionManager.childPartStockExcel(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Stock-Inward-Details" + newdate);
    });
  }

  // ------Part----------

  partViewClick() {
    this.rawmaterialinspectionManager.PartStockPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  partPdfReport() {
    this.rawmaterialinspectionManager.PartStockPdf(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Stock-Inward-Details" + newdate);
    })
  }

  partExcelReport() {
    this.rawmaterialinspectionManager.PartStockExcel(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Stock-Inward-Details" + newdate);
    });
  }

}
