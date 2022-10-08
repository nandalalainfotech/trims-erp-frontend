import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { IconRendererComponent } from '../services/renderercomponent/icon-renderer-component';
import { AuthManager } from '../services/restcontroller/bizservice/auth-manager.service';
import { CustomerContactManager } from '../services/restcontroller/bizservice/customer-contact.service';
import { Login001mb } from '../services/restcontroller/entities/Login001mb';
import { CalloutService } from '../services/services/callout.service';
import { DataSharedService } from '../services/services/datashared.service';

@Component({
  selector: 'app-customer-po',
  templateUrl: './customer-po.component.html',
  styleUrls: ['./customer-po.component.css']
})
export class CustomerPoComponent implements OnInit {
  customerPOForm: FormGroup | any;
  customerPOFormArray: FormArray | any;
  frameworkComponents: any;
  public gridOptions: GridOptions | any;
  submitted = false;
  partCode: number | any;
  partName: string | any;
  description: string | any;
  uom: string | any;
  unitrate: string | any;
  qunty:string | any;
  totalamount: number | any;
  drawingNo: string | any;
  revisionNo: string | any;
  revisionDate:string | any;
  hsn:string | any;
  gst: string | any;
  insertUser: string = "";
  insertDatetime?: Date;
  updatedUser: string = "";
  updatedDatetime?: Date | null;

  user?:Login001mb|any;
  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private authManager: AuthManager,
    private calloutService: CalloutService,
    private customerContactManager: CustomerContactManager,
    private dataSharedService: DataSharedService,
    private modalService: NgbModal,
    private httpClient: HttpClient,
    private http: HttpClient
  ) {
    this.frameworkComponents = {
      iconRenderer: IconRendererComponent,
    };
  }

  ngOnInit(): void {
    this.user = this.authManager.getcurrentUser;
    this.customerPOForm = this.formBuilder.group({
      customerPOFormArray: this.formBuilder.array([this.createItem()]),
    });
  }
  get f() {
    return this.customerPOForm.controls;
  }
  get o() {
    return this.f.customerPOFormArray as FormArray;
  }
  createItem() {
    return this.formBuilder.group({
      partCode: [''],
      partName: [''],
      description: [''],
      uom: [''],
      unitrate: [''],
      qunty: [''],
      totalamount: [''],
      drawingNo: [''],
      revisionNo: [''],
      revisionDate: [''],
      hsn: [''],
      gst: [''],
    });
  }
  onOkClick(event: any, customerPOForm: any) { }

  onChangeQty(event: any, index: any) {}

  addItem() {
    this.customerPOFormArray = this.f['customerPOFormArray'] as FormArray;
    // let status: boolean = false;
    // for(let control of this.custemerregFormArray.controls) {
    //   if(control.status == 'INVALID'){
    //     this.calloutService.showError("An input field is missing!");
    //     status = true;
    //     break;
    //   }
    // }
    // if(status) {
    //   return;
    // }
    this.customerPOFormArray.push(this.createItem());//naresh
  }

  removeItem(idx: number): void {
    (this.f['customerPOFormArray'] as FormArray).removeAt(idx);
  }

  onCancelClick() {
    this.activeModal.close('No');
  }
}
