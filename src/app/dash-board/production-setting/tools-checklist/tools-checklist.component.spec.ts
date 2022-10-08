import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsChecklistComponent } from './tools-checklist.component';

describe('ToolsChecklistComponent', () => {
  let component: ToolsChecklistComponent;
  let fixture: ComponentFixture<ToolsChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolsChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
