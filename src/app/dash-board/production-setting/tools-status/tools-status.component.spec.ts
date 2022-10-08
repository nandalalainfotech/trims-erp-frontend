import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsStatusComponent } from './tools-status.component';

describe('ToolsStatusComponent', () => {
  let component: ToolsStatusComponent;
  let fixture: ComponentFixture<ToolsStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolsStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
