import { Component, HostBinding, Input } from '@angular/core';

export type ButtonGroupOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'app-button-group',
  standalone: true,
  template: '<div class="button-group"><ng-content></ng-content></div>',
  styleUrl: './button-group.component.scss',
})
export class ButtonGroupComponent {
  @Input() orientation: ButtonGroupOrientation = 'horizontal';

  @HostBinding('attr.data-orientation')
  get dataOrientation(): ButtonGroupOrientation {
    return this.orientation;
  }

  @HostBinding('class')
  get classes(): string {
    return `button-group ${this.orientation}`;
  }
}
