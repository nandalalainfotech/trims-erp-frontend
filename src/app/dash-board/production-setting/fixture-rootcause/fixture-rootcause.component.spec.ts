import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixtureRootcauseComponent } from './fixture-rootcause.component';

describe('FixtureRootcauseComponent', () => {
  let component: FixtureRootcauseComponent;
  let fixture: ComponentFixture<FixtureRootcauseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixtureRootcauseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixtureRootcauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
