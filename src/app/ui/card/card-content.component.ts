import { Component } from '@angular/core';

@Component({
  selector: 'app-card-content',
  standalone: true,
  template: '<div class="card-content"><ng-content></ng-content></div>',
  styleUrl: './card-content.component.scss',
})
export class CardContentComponent {}
