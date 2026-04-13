/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TreinamentosComponent } from './treinamentos.component';

describe('DashboardComponent', () => {
  let component: TreinamentosComponent;
  let fixture: ComponentFixture<TreinamentosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreinamentosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreinamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
