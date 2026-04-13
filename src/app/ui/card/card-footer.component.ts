import { Component } from '@angular/core';

@Component({
  selector: 'app-card-footer',
  standalone: true,
  template: '<div class="card-footer"><ng-content></ng-content></div>',
  styleUrl: './card-footer.component.scss',
})
export class CardFooterComponent {}
