import { Component, HostBinding, Input } from '@angular/core';

export type FieldOrientation = 'vertical' | 'horizontal' | 'responsive';

@Component({
  selector: 'app-field',
  standalone: true,
  template: '<div class="field"><ng-content></ng-content></div>',
  styleUrl: './field.component.scss',
})
export class FieldComponent {
  @Input() orientation: FieldOrientation = 'vertical';

  @HostBinding('class')
  get classes(): string {
    return `field ${this.orientation}`;
  }
}
