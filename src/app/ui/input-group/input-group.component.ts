import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-input-group',
  standalone: true,
  template: '<div class="input-group"><ng-content></ng-content></div>',
  styleUrl: './input-group.component.scss',
})
export class InputGroupComponent {
  @HostBinding('class')
  get classes(): string {
    return 'input-group-host';
  }
}
