import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'front-zapfarma-contato-cliente',
  templateUrl: './contato-cliente.component.html',
  styleUrls: ['./contato-cliente.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContatoClienteComponent {

  _id: any

  constructor(
      private router: Router,
      private routerActivate: ActivatedRoute,

  ) {

    this.routerActivate.queryParamMap.subscribe((params: any) => {
      this._id = params.params.id;
      // window.open('https://wa.me/5521984384352')
        window.location.replace("whatsapp://send/?phone=5521984384352&text=Pedido de teste")
      // window.open('whatsapp://send?phone=5521984384352&text=Pedido de teste')
      
   })
  }

}
