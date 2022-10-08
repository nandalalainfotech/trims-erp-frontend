import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsBreakdownComponent } from './tools-breakdown.component';

describe('ToolsBreakdownComponent', () => {
  let component: ToolsBreakdownComponent;
  let fixture: ComponentFixture<ToolsBreakdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolsBreakdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
