import { Component } from '@angular/core';

@Component({
  selector: 'app-card-action',
  standalone: true,
  template: '<div class="card-action"><ng-content></ng-content></div>',
  styleUrl: './card-action.component.scss',
})
export class CardActionComponent {}
