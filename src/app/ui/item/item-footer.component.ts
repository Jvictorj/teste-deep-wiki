import { Component } from '@angular/core';

@Component({
  selector: 'app-item-footer',
  standalone: true,
  template: '<div class="item-footer"><ng-content></ng-content></div>',
  styleUrl: './item-footer.component.scss',
})
export class ItemFooterComponent {}
