import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixtureChecklistComponent } from './fixture-checklist.component';

describe('FixtureChecklistComponent', () => {
  let component: FixtureChecklistComponent;
  let fixture: ComponentFixture<FixtureChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixtureChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixtureChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
