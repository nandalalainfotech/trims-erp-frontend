import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixtureStatusComponent } from './fixture-status.component';

describe('FixtureStatusComponent', () => {
  let component: FixtureStatusComponent;
  let fixture: ComponentFixture<FixtureStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixtureStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixtureStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
