import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'front-zapfarma-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FooterComponent {

  @Input() voltar = false;
  @Input() isArrow = true;
  @Input() desativado = false;
  @Input() textoBotao = '';
  @Output() clickProximo =  new EventEmitter<boolean>();

  proximaPagina() {
    this.clickProximo.emit(true);
  }
  

}
