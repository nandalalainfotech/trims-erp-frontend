import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturePreventiveActionComponent } from './fixture-preventive-action.component';

describe('FixturePreventiveActionComponent', () => {
  let component: FixturePreventiveActionComponent;
  let fixture: ComponentFixture<FixturePreventiveActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixturePreventiveActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturePreventiveActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
