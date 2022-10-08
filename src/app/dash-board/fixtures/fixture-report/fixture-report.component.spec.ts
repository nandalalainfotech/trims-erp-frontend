import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixtureReportComponent } from './fixture-report.component';

describe('FixtureReportComponent', () => {
  let component: FixtureReportComponent;
  let fixture: ComponentFixture<FixtureReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixtureReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixtureReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
