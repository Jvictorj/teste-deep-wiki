import { Component, Input } from '@angular/core';

export type InputGroupAddonAlign = 'inline-start' | 'inline-end' | 'block-start' | 'block-end';

@Component({
  selector: 'app-input-group-addon',
  standalone: true,
  template: '<div class="input-addon" [attr.data-align]="align"><ng-content></ng-content></div>',
  styleUrl: './input-group-addon.component.scss',
})
export class InputGroupAddonComponent {
  @Input() align: InputGroupAddonAlign = 'inline-start';
}
