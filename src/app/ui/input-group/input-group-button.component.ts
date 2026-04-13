import { Component, Input } from '@angular/core';

export type InputGroupButtonSize = 'xs' | 'sm' | 'icon-xs' | 'icon-sm';

@Component({
  selector: 'app-input-group-button',
  standalone: true,
  template: '<button class="input-group-button" type="button"><ng-content></ng-content></button>',
  styleUrl: './input-group-button.component.scss',
})
export class InputGroupButtonComponent {
  @Input() size: InputGroupButtonSize = 'xs';
}
