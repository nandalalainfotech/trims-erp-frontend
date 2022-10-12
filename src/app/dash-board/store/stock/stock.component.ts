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
import { MaterialMomentsManager } from 'src/app/shared/services/restcontroller/bizservice/Materialmoments.service';
import { MaterialreceiveditemManager } from 'src/app/shared/services/restcontroller/bizservice/Materialreceiveditem.service';
import { MaterialStockManager } from 'src/app/shared/services/restcontroller/bizservice/materialStock.service';
import { OrderItemSettingManager } from 'src/app/shared/services/restcontroller/bizservice/orderItems.service';
import { PartManager } from 'src/app/shared/services/restcontroller/bizservice/part.service';
import { RawmaterialinspectionManager } from 'src/app/shared/services/restcontroller/bizservice/Rawmaterialinspection.service';
import { ChildPart001mb } from 'src/app/shared/services/restcontroller/entities/ChildPart001mb';
import { Consumble001mb } from 'src/app/shared/services/restcontroller/entities/Consumble001mb';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { Materialreceiveditem001wb } from 'src/app/shared/services/restcontroller/entities/Materialreceiveditem001wb';
import { Orderitem001mb } from 'src/app/shared/services/restcontroller/entities/Orderitem001mb';
import { Part001mb } from 'src/app/shared/services/restcontroller/entities/Part001mb';
import { Rawmaterialinspection001wb } from 'src/app/shared/services/restcontroller/entities/Rawmaterialinspection001wb';
import { MaterialStock001wb } from 'src/app/shared/services/restcontroller/entities/stock001wb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

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
  itemCode: Rawmaterialinspection001wb[] = [];
  rawmaterialinspection001wb_itemcode: number | any;
  rawmaterialinspection001wb_cucode: number | any;
  rawmetriealcodes: any = [];
  Consumablecodes: any = [];
  ChildPartcodes: any = [];
  Partcodes: any = [];

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
    forkJoin([res0, res1, res2, res3, res4]).subscribe((data: any) => {
      this.rawmaterialinspection001wbs = deserialize<Rawmaterialinspection001wb[]>(Rawmaterialinspection001wb, data[0]);
      this.consumble001mbs = deserialize<Consumble001mb[]>(Consumble001mb, data[1]);
      this.part001mbs = deserialize<Part001mb[]>(Part001mb, data[2]);
      this.childPart001mbs = deserialize<ChildPart001mb[]>(ChildPart001mb, data[3]);
      this.orderitem001mbs = deserialize<Orderitem001mb[]>(Orderitem001mb, data[4]);
    });
    this.loadData();

    this.rawmaterialinspectionManager.findByItem(this.user.unitslno).subscribe(response => {
      this.rawmaterialinspection001wbs = deserialize<Rawmaterialinspection001wb[]>(Rawmaterialinspection001wb, response);


    });
  }


  get f() { return this.materialStockForm.controls }

  loadData() {

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
      }
      this.rawmetriealcodes = this.rawmetriealcodes.filter((e, i) =>  this.rawmetriealcodes.findIndex(a => a["itemcode"] === e["itemcode"]) === i);
      this.Consumablecodes = this.Consumablecodes.filter((e, i) =>  this.Consumablecodes.findIndex(a => a["cucode"] === e["cucode"]) === i);
      this.ChildPartcodes = this.ChildPartcodes.filter((e, i) =>  this.ChildPartcodes.findIndex(a => a["cptcode"] === e["cptcode"]) === i);
      this.Partcodes = this.Partcodes.filter((e, i) =>  this.Partcodes.findIndex(a => a["prtcode"] === e["prtcode"]) === i);
      if (this.rawmetriealcodes.length > 0) {
        this.gridOptions1?.api?.setRowData(this.rawmetriealcodes);
      } else {
        this.gridOptions1?.api?.setRowData([]);
      }
       if (this.Consumablecodes.length > 0) {
        this.gridOptions2?.api?.setRowData(this.Consumablecodes);
      } else {
        this.gridOptions2?.api?.setRowData([]);
      }
      if (this.ChildPartcodes.length > 0) {
        this.gridOptions3?.api?.setRowData(this.ChildPartcodes);
      } else {
        this.gridOptions3?.api?.setRowData([]);
      }
       if (this.Partcodes.length > 0) {
        this.gridOptions4?.api?.setRowData(this.Partcodes);
      } else {
        this.gridOptions4?.api?.setRowData([]);
      }
    });
      // this.rawmaterialinspectionManager.findByItem(this.user.unitslno).subscribe(response => {
    //   this.rawmaterialinspection001wbs = deserialize<Rawmaterialinspection001wb[]>(Rawmaterialinspection001wb, response);
    //   console.log("this.rawmaterialinspection001wbs",this.rawmaterialinspection001wbs);
      
    //   if (this.rawmaterialinspection001wbs.length > 0) {
    //     this.gridOptions1?.api?.setRowData(this.rawmaterialinspection001wbs);
    //   } else {
    //     this.gridOptions1?.api?.setRowData([]);
    //   }

    // });

    // this.rawmaterialinspectionManager.findByConsumableItem(this.user.unitslno).subscribe(response => {
    //   this.rawmaterialinspection001wbs = deserialize<Rawmaterialinspection001wb[]>(Rawmaterialinspection001wb, response);
    //   if (this.rawmaterialinspection001wbs.length > 0) {
    //     this.gridOptions2?.api?.setRowData(this.rawmaterialinspection001wbs);
    //   } else {
    //     this.gridOptions2?.api?.setRowData([]);
    //   }
    // });

    // this.rawmaterialinspectionManager.findByChildItem(this.user.unitslno).subscribe(response => {
    //   this.rawmaterialinspection001wbs = deserialize<Rawmaterialinspection001wb[]>(Rawmaterialinspection001wb, response);
    //   if (this.rawmaterialinspection001wbs.length > 0) {
    //     this.gridOptions3?.api?.setRowData(this.rawmaterialinspection001wbs);
    //   } else {
    //     this.gridOptions3?.api?.setRowData([]);
    //   }
    // });

    // this.rawmaterialinspectionManager.findByPartItem(this.user.unitslno).subscribe(response => {
    //   this.rawmaterialinspection001wbs = deserialize<Rawmaterialinspection001wb[]>(Rawmaterialinspection001wb, response);
    //   console.log("this.rawmaterialinspection001wbs", this.rawmaterialinspection001wbs);

    //   if (this.rawmaterialinspection001wbs.length > 0) {
    //     this.gridOptions4?.api?.setRowData(this.rawmaterialinspection001wbs);
    //   } else {
    //     this.gridOptions4?.api?.setRowData([]);
    //   }
    // });

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
        headerName: 'Opening Balance',
        field: 'acceptedsum',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: (params: { data: { acceptedsum: number, itemcode2: { mslevel: number } } }) => {
          if (params.data.acceptedsum <= params.data.itemcode2.mslevel) {
            return { background: '#FF5733' };
          } else if(params.data.acceptedsum >= params.data.itemcode2.mslevel) {
            return { background: '#00FFFF' };
          }
          return null;
        },
      },
      {
        headerName: 'Closing Balance',
        field: 'closing',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Location',
        field: 'location',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        valueGetter: this.setlocation.bind(this)
      },
      {
        headerName: 'M.S.Level',
        field: 'mslevel',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: (params: { data: { acceptedsum: number, itemcode2: { mslevel: number } } }) => {
          if (params.data.acceptedsum < params.data.itemcode2.mslevel) {
            return { background: '#ff0000' };
          } else {
            return { background: '#FFFF00' };
          }
          return null;
        },
        valueGetter: this.setMSLevel.bind(this)
      },
      {
        headerName: 'Lead Time',
        field: 'leadtime',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        valueGetter: this.setleadtime.bind(this)
      },
      {
        headerName: 'Re-Order Level',
        field: 'orderlevel',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        valueGetter: this.setorderlevel.bind(this)
      },
     

    ];
  }

  setitemcode(params: any): string {
    return params.data.itemcode2 ? params.data.itemcode2.itemcode : null;
  }
  setlocation(params: any): string {
    return params.data.itemcode2 ? params.data.itemcode2 .location : null;
  }
  setMSLevel(params: any): string {
    return params.data.itemcode2 ? params.data.itemcode2 .mslevel : null;
  }
  setleadtime(params: any): string {
    return params.data.itemcode2 ? params.data.itemcode2 .leadtime : null;
  }
  setorderlevel(params: any): string {
    return params.data.itemcode2 ? params.data.itemcode2 .orderlevel : null;
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
    // if (params.data.acceptedQty < params.data.itemcode2_mslevel) {
    //   return { 'background-color': '#FF0000' };
    // } else {
    //   return { 'background-color': ' #FFFF00 ' };
    // }
    // return true

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
        headerName: 'Opening Balance',
        field: 'cuacceptedsum',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: (params: { data: { cuacceptedsum: number, cucode2: { mslevel: number } } }) => {
          if (params.data.cuacceptedsum <= params.data.cucode2.mslevel) {
            return { background: '#FF8C00' };
          }  else if (params.data.cuacceptedsum >= params.data.cucode2.mslevel) {
            return { background: '#0000FF' };
          }
          return null;
        },
      },
      {
        headerName: 'Closing Balance',
        field: 'cucolsing',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Location',
        field: 'location',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        valueGetter: this.setculocation.bind(this)
      },
      {
        headerName: 'M.S.Level',
        field: 'mslevel',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: (params: { data: { cuacceptedsum: number, cucode2: { mslevel: number } } }) => {
          if (params.data.cuacceptedsum < params.data.cucode2.mslevel) {
            return { background: '#ff0000' };
          } else {
            return { background: '#FFFF00' };
          }
          return null;
        },
        valueGetter: this.setcuMSLevel.bind(this)
      },
      {
        headerName: 'Lead Time',
        field: 'leadtime',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        valueGetter: this.setculeadtime.bind(this)
      },
      {
        headerName: 'Re-Order Level',
        field: 'orderlevel',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        valueGetter: this.setcuorderlevel.bind(this)
      },

    ];
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
        headerName: 'Opening Balance',
        field: 'cptacceptedsum',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: (params: { data: { cptacceptedsum: number, cptcode2: { mslevel: number } } }) => {
          if (params.data.cptacceptedsum <= params.data.cptcode2.mslevel) {
            return { background: '#FF8C00' };
          } else if (params.data.cptacceptedsum >= params.data.cptcode2.mslevel) {
            return { background: '#0000FF' };
          }
          return null;
        },
      },
      {
        headerName: 'Closing Balance',
        field: 'cptcolsing',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Location',
        field: 'location',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        valueGetter: this.setcptlocation.bind(this)
      },
      {
        headerName: 'M.S.Level',
        field: 'mslevel',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: (params: { data: { cptacceptedsum: number, cptcode2: { mslevel: number } } }) => {
          if (params.data.cptacceptedsum < params.data.cptcode2.mslevel) {
            return { background: '#ff0000' };
          } else {
            return { background: '#FFFF00' };
          }
          return null;
        },
        valueGetter: this.setcptMSLevel.bind(this)
      },
      {
        headerName: 'Lead Time',
        field: 'leadtime',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        valueGetter: this.setcptleadtime.bind(this)
      },
      {
        headerName: 'Re-Order Level',
        field: 'orderlevel',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        valueGetter: this.setcptorderlevel.bind(this)
      },

    ];
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
        headerName: 'Opening Balance',
        field: 'prtacceptedsum',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: (params: { data: { prtacceptedsum: number, prtcode2: { mslevel: number } } }) => {
          if (params.data.prtacceptedsum < params.data.prtcode2.mslevel) {
            return { background: '#FF8C00' };
          } else if (params.data.prtacceptedsum >= params.data.prtcode2.mslevel) {
            return { background: '#0000FF' };
          }
          return null;
        },
      },
      {
        headerName: 'Closing Balance',
        field: 'prtcolsing',
        width: 200,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Location',
        field: 'location',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: { textAlign: 'center' },
        valueGetter: this.setprtlocation.bind(this)
      },
      {
        headerName: 'M.S.Level',
        field: 'mslevel',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        suppressSizeToFit: true,
        cellStyle: (params: { data: { prtacceptedsum: number, prtcode2: { mslevel: number } } }) => {
          if (params.data.prtacceptedsum < params.data.prtcode2.mslevel) {
            return { background: '#ff0000' };
          } else {
            return { background: '#FFFF00' };
          }
          return null;
        },
        valueGetter: this.setprtMSLevel.bind(this)
      },
      {
        headerName: 'Lead Time',
        field: 'leadtime',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        valueGetter: this.setprtleadtime.bind(this)
      },
      {
        headerName: 'Re-Order Level',
        field: 'orderlevel',
        width: 100,
        // flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { textAlign: 'center' },
        suppressSizeToFit: true,
        valueGetter: this.setprtorderlevel.bind(this)
      },
     
    ];
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
    //   consumableItems: any = [];
    // childpartItems: any = [];
    // partItems: any = [];
    let Returnitems: any = [];
    if (params.data.itemcode ? params.data.itemcode : null) {
      this.rawmetriealItems.push(params.data)
    } else if (params.data.cucode ? params.data.cucode : null) {
      this.consumableItems.push(params.data)
    } else if (params.data.cptcode ? params.data.cptcode : null) {
      this.childpartItems.push(params.data)
    } else if (params.data.prtcode ? params.data.prtcode : null) {
      this.partItems.push(params.data)
    }
    if (this.rawmetriealItems.length > 0) {
      Returnitems = "Raw Material";
    } if (this.consumableItems.length > 0) {
      Returnitems = "Consumable Item";
    } if (this.childpartItems.length > 0) {
      Returnitems = "Child Part";
    } if (this.partItems.length > 0) {
      Returnitems = "Part";
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
    this.rawmaterialinspectionManager.itemPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  itemPdfReport() {
    this.rawmaterialinspectionManager.itemPdf(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Stock-Details" + newdate);
    })
  }

  itemExcelReport() {
    this.rawmaterialinspectionManager.itemExcel(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Stock-Details" + newdate);
    });
  }

  // ------------consumablePdf-----------------

  consumableViewClick() {
    this.rawmaterialinspectionManager.consumablePdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  consumablePdfReport() {
    this.rawmaterialinspectionManager.consumablePdf(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Stock-Details" + newdate);
    })
  }

  consumableExcelReport() {
    this.rawmaterialinspectionManager.consumableExcel(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Stock-Details" + newdate);
    });
  }

  // ------Childpart----------------

  childPartViewClick() {
    this.rawmaterialinspectionManager.childPartPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  childPartPdfReport() {
    this.rawmaterialinspectionManager.childPartPdf(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Stock-Details" + newdate);
    })
  }

  childPartExcelReport() {
    this.rawmaterialinspectionManager.childPartExcel(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Stock-Details" + newdate);
    });
  }

  // ------Part----------

  partViewClick() {
    this.rawmaterialinspectionManager.PartPdf(this.user.unitslno).subscribe((response) => {
      var blob = new Blob([response], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    })
  }

  partPdfReport() {
    this.rawmaterialinspectionManager.PartPdf(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Stock-Details" + newdate);
    })
  }

  partExcelReport() {
    this.rawmaterialinspectionManager.PartExcel(this.user.unitslno).subscribe((response) => {
      let date = new Date();
      let newdate = this.datepipe.transform(date, 'dd-MM-yyyy');
      saveAs(response, "Stock-Details" + newdate);
    });
  }

}
