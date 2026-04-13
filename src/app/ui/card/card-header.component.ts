import { Component } from '@angular/core';

@Component({
  selector: 'app-card-header',
  standalone: true,
  template: '<div class="card-header"><ng-content></ng-content></div>',
  styleUrl: './card-header.component.scss',
})
export class CardHeaderComponent {}
