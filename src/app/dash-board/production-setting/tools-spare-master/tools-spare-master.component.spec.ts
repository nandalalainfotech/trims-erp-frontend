import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsSpareMasterComponent } from './tools-spare-master.component';

describe('ToolsSpareMasterComponent', () => {
  let component: ToolsSpareMasterComponent;
  let fixture: ComponentFixture<ToolsSpareMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolsSpareMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsSpareMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
