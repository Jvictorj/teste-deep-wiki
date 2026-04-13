import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-separator',
  standalone: true,
  template: '<div class="separator"></div>',
  styleUrl: './separator.component.scss',
})
export class SeparatorComponent {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';

  @HostBinding('class')
  get classes(): string {
    return `separator-${this.orientation}`;
  }
}
