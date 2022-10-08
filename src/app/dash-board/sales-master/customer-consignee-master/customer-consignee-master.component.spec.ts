import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerConsigneeMasterComponent } from './customer-consignee-master.component';

describe('CustomerConsigneeMasterComponent', () => {
  let component: CustomerConsigneeMasterComponent;
  let fixture: ComponentFixture<CustomerConsigneeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerConsigneeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerConsigneeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
