/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TemosUsoComponent } from './temos-uso.component';

describe('TemosUsoComponent', () => {
  let component: TemosUsoComponent;
  let fixture: ComponentFixture<TemosUsoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemosUsoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemosUsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
