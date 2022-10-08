import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPoMasterComponent } from './customer-po-master.component';

describe('CustomerPoMasterComponent', () => {
  let component: CustomerPoMasterComponent;
  let fixture: ComponentFixture<CustomerPoMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerPoMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPoMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
