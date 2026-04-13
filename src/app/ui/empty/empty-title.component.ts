import { Component } from '@angular/core';

@Component({
  selector: 'app-empty-title',
  standalone: true,
  template: '<div class="empty-title"><ng-content></ng-content></div>',
  styleUrl: './empty-title.component.scss',
})
export class EmptyTitleComponent {}
