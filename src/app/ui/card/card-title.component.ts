import { Component } from '@angular/core';

@Component({
  selector: 'app-card-title',
  standalone: true,
  template: '<div class="card-title"><ng-content></ng-content></div>',
  styleUrl: './card-title.component.scss',
})
export class CardTitleComponent {}
