import { Component } from '@angular/core';

@Component({
  selector: 'app-hover-card-content',
  standalone: true,
  template: '<div class="hover-card-content"><ng-content></ng-content></div>',
  styleUrl: './hover-card-content.component.scss',
})
export class HoverCardContentComponent {}
