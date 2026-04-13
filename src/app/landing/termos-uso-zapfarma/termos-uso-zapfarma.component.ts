import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../../landing/footer/footer.component';
import { HeaderComponent } from '../../landing/header/header.component';

@Component({
  selector: 'front-zapfarma-termos-uso',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './termos-uso-zapfarma.component.html',
  styleUrl: './termos-uso-zapfarma.component.scss',
})
export class TermosUsoZapfarmaComponent {}
