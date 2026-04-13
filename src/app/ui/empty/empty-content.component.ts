import { Component } from '@angular/core';

@Component({
  selector: 'app-empty-content',
  standalone: true,
  template: '<div class="empty-content"><ng-content></ng-content></div>',
  styleUrl: './empty-content.component.scss',
})
export class EmptyContentComponent {}
