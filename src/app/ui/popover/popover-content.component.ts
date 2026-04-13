import { Component } from '@angular/core';

@Component({
  selector: 'app-popover-content',
  standalone: true,
  template: '<div class="popover-content"><ng-content></ng-content></div>',
  styleUrl: './popover-content.component.scss',
})
export class PopoverContentComponent {}
