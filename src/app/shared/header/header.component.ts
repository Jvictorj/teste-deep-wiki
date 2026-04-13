import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'front-zapfarma-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class frontZapFarmaHeaderComponent {

  @Input() voltar = false;
  @Input() isLogo = false;
  @Input() container = false;
  @Input() title = '';
  @Input() padding = false;

  @Output() clickVoltar =  new EventEmitter<boolean>();


  voltarPagina() {
    this.clickVoltar.emit(true);
  }

}
