import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgxMaskDirective } from 'ngx-mask';
import { frontZapFarmaHeaderComponent } from 'src/app/shared/header/header.component';
import { frontZapFarmaMenuComponent } from 'src/app/shared/menu/menu.component';

@Component({
  selector: 'front-zapfarma-mensageria',
  templateUrl: './mensageria.component.html',
  styleUrls: ['./mensageria.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule, 
    frontZapFarmaMenuComponent, 
    frontZapFarmaHeaderComponent, 
    ReactiveFormsModule, 
    NgxMaskDirective, 
    HttpClientModule,
    MatCardModule,
    MatButtonModule
  ],
})
export class MensageriaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
