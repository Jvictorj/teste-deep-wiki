import { Component } from '@angular/core';

@Component({
  selector: 'app-scroll-area',
  standalone: true,
  template: '<div class="scroll-area"><div class="scroll-viewport"><ng-content></ng-content></div></div>',
  styleUrl: './scroll-area.component.scss',
})
export class ScrollAreaComponent {}
