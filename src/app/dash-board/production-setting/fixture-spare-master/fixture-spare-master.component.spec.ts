import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixtureSpareMasterComponent } from './fixture-spare-master.component';

describe('FixtureSpareMasterComponent', () => {
  let component: FixtureSpareMasterComponent;
  let fixture: ComponentFixture<FixtureSpareMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixtureSpareMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixtureSpareMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
