import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsPreventiveActionComponent } from './tools-preventive-action.component';

describe('ToolsPreventiveActionComponent', () => {
  let component: ToolsPreventiveActionComponent;
  let fixture: ComponentFixture<ToolsPreventiveActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolsPreventiveActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsPreventiveActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
