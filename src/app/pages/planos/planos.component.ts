import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { FooterComponent } from 'src/app/shared/footer/footer.component';
import { frontZapFarmaHeaderComponent } from 'src/app/shared/header/header.component';
import { frontZapFarmaMenuComponent } from 'src/app/shared/menu/menu.component';
import { ToolbarComponent } from 'src/app/shared/toolbar/toolbar.component';

@Component({
  selector: 'front-zapfarma-planos',
  templateUrl: './planos.component.html',
  styleUrls: ['./planos.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
   imports: [
      CommonModule,
      frontZapFarmaMenuComponent,
      frontZapFarmaHeaderComponent,
      FooterComponent,
      ReactiveFormsModule,
      NgxMaskDirective,
      HttpClientModule,
      ToolbarComponent
    ],
})
export class PlanosComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
