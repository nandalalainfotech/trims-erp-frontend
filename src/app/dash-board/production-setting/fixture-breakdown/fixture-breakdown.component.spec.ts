import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixtureBreakdownComponent } from './fixture-breakdown.component';

describe('FixtureBreakdownComponent', () => {
  let component: FixtureBreakdownComponent;
  let fixture: ComponentFixture<FixtureBreakdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixtureBreakdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixtureBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
