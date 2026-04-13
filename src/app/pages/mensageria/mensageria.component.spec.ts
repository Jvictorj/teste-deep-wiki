/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MensageriaComponent } from './mensageria.component';

describe('MensageriaComponent', () => {
  let component: MensageriaComponent;
  let fixture: ComponentFixture<MensageriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensageriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensageriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
