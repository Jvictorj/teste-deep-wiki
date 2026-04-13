import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../../landing/footer/footer.component';
import { HeaderComponent } from '../../landing/header/header.component';

@Component({
  selector: 'front-zapfarma-politica-privacidade',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './politica-privacidade-zapfarma.component.html',
  styleUrl: './politica-privacidade-zapfarma.component.scss',
})
export class PoliticaPrivacidadeZapfarmaComponent {}
