import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixtureBreakdownRegisterComponent } from './fixture-breakdown-register.component';

describe('FixtureBreakdownRegisterComponent', () => {
  let component: FixtureBreakdownRegisterComponent;
  let fixture: ComponentFixture<FixtureBreakdownRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixtureBreakdownRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixtureBreakdownRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
