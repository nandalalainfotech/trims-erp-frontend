import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsRootcauseComponent } from './tools-rootcause.component';

describe('ToolsRootcauseComponent', () => {
  let component: ToolsRootcauseComponent;
  let fixture: ComponentFixture<ToolsRootcauseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolsRootcauseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsRootcauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
