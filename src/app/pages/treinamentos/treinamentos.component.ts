import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective } from 'ngx-mask';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { frontZapFarmaMenuComponent } from 'src/app/shared/menu/menu.component';

@Component({
  selector: 'front-zapfarma-treinamentos',
  templateUrl: './treinamentos.component.html',
  styleUrls: ['./treinamentos.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule, 
    frontZapFarmaMenuComponent, 
    ReactiveFormsModule, 
    NgxMaskDirective, 
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
})
export class TreinamentosComponent implements OnInit {
  usuario:any;
  constructor(
    private _usuariosService: UsuariosService,
  ) {
    this.usuario = this._usuariosService.obterUsuarioLogado;
   }

  ngOnInit() {
  }

}
