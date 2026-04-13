import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToolbarComponent } from 'src/app/shared/toolbar/toolbar.component';
import { RodapeComponent } from '../rodape/rodape.component';

type Store = {
  name: string;
  address: string;
  complement?: string;
  phones?: string[];
  mapsUrl: string;
  photo: string;
};

@Component({
  selector: 'front-zapfarma-lojas',
  standalone: true,
  templateUrl: './lojas.component.html',
  styleUrls: ['./lojas.component.scss'],
  imports: [CommonModule, RouterModule, ToolbarComponent, RodapeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LojasComponent {
  readonly stores: Store[] = [
    {
      name: 'Drogaria Alves Leite (Mais Barato)',
      address: 'Rua Dois de Maio, 735 - Sampaio, Rio de Janeiro - RJ',
      phones: ['(21) 96534-6653'],
      mapsUrl: 'https://www.google.com/maps/place/Rua+Dois+de+Maio,+735+-+Sampaio,+Rio+de+Janeiro+-+RJ',
      photo: 'assets/imgs/logo-testimonial/drogarias-mais-barato-logo.png',
    },
    {
      name: 'Cfcosta Pharma (Mundial)',
      address: 'Estrada Senador Salgado Filho, 518 - Olinda, Nilópolis - RJ',
      phones: ['(21) 96525-6000 | ', '(21) 96546-5000'],
      mapsUrl: 'https://www.google.com/maps/place/Estrada+Senador+Salgado+Filho,+518+-+Olinda,+Nil%C3%B3polis+-+RJ',
      photo: 'assets/imgs/logo-testimonial/logo-mundial.png',
    },
    {
      name: 'Siqueira Alves Drogaria (Mais Barato)',
      address: 'Estrada Marechal Miguel Salazar Mendes de Morais, 1580 - Loja A - Cidade de Deus, Rio de Janeiro - RJ',
      phones: ['(21) 98168-2487 | ', '(21) 98218-9474'],
      mapsUrl: 'https://www.google.com/maps/place/Estrada+Marechal+Miguel+Salazar+Mendes+de+Morais,+1580+-+Loja+A+-+Cidade+de+Deus,+Rio+de+Janeiro+-+RJ',
      photo: 'assets/imgs/logo-testimonial/drogarias-mais-barato-logo.png',
    },
    {
      name: 'Drogaria Nacional de Ramos (Mais Saúde)',
      address: 'Rua Gerson Ferreira, 9 - Ramos, Rio de Janeiro - RJ',
      phones: ['(21) 96678-2183'],
      mapsUrl: 'https://www.google.com/maps/place/Rua+Gerson+Ferreira,+9+-+Ramos,+Rio+de+Janeiro+-+RJ',
      photo: 'assets/imgs/logo-testimonial/logo-mais-saude.jpeg',
    },
  ];
}
