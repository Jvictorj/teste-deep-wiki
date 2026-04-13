import { Component } from '@angular/core';

@Component({
  selector: 'app-empty-header',
  standalone: true,
  template: '<div class="empty-header"><ng-content></ng-content></div>',
  styleUrl: './empty-header.component.scss',
})
export class EmptyHeaderComponent {}
