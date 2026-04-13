import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AboutSectionComponent } from '../../landing/about-section/about-section.component';
import { FooterComponent } from '../../landing/footer/footer.component';
import { HeaderComponent } from '../../landing/header/header.component';


@Component({
  selector: 'front-zapfarma-sobre',
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
      CommonModule,
      HeaderComponent,
      AboutSectionComponent,
      FooterComponent
    ]

})
export class SobreComponent {

}
