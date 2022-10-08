import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { AddCustomerContactComponent } from 'src/app/shared/add-customer-contact/add-customer-contact.component';
import { CustomerPoComponent } from 'src/app/shared/customer-po/customer-po.component';
import { IconRendererComponent } from 'src/app/shared/services/renderercomponent/icon-renderer-component';
import { AuthManager } from 'src/app/shared/services/restcontroller/bizservice/auth-manager.service';
import { Login001mb } from 'src/app/shared/services/restcontroller/entities/Login001mb';
import { CalloutService } from 'src/app/shared/services/services/callout.service';

@Component({
  selector: 'app-customer-po-master',
  templateUrl: './customer-po-master.component.html',
  styleUrls: ['./customer-po-master.component.css']
})
export class CustomerPoMasterComponent implements OnInit {
  custemerPOForm: FormGroup | any;
  frameworkComponents: any;
  submitted = false;
  public gridOptions: GridOptions | any;

  custemercode: number |any;
  custemername: string="";
  custemerPONo: string="";
  poDate?: Date | null;
  deliveryDate: string="";
  packing: string="";
  logistic: string="";
  inspection: string="";
  insertUser: string = "";
  insertDatetime?: Date;
  updatedUser: string = "";
  updatedDatetime?: Date | null;

  user?: Login001mb | any;
    unitslno: number | any;
    
  constructor(
    private formBuilder: FormBuilder,
    private calloutService: CalloutService,
    private authManager: AuthManager,
    private modalService: NgbModal,
     private http: HttpClient) {
    this.frameworkComponents = {
        iconRenderer: IconRendererComponent
    }

}

  ngOnInit(): void {
    this.user = this.authManager.getcurrentUser;

    this.custemerPOForm = this.formBuilder.group({
      custemername: ['', Validators.required],
      custemercode: ['', Validators.required],
      custemerPONo: ['', Validators.required],
      poDate: ['', Validators.required],
      deliveryDate: ['', Validators.required],
      packing: ['', Validators.required],
      logistic: ['', Validators.required],
      inspection: ['', Validators.required],
     
  })
  }

  onAddbuttonClick() {
    const modalRef = this.modalService.open(CustomerPoComponent, { windowClass: 'my-class' });
    modalRef.componentInstance.customercontacts = "hi";


    // modalRef.componentInstance.custemerRegForm = this.custemerRegForm;
    // modalRef.result.then((data) => {
    //   if (data.status == 'Yes') {
    //     this.customercontacts = data.customercontacts;

    //   }
    // })
  }

}
