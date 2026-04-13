import { Component, Input } from '@angular/core';

export type ButtonGroupSeparatorOrientation = 'vertical' | 'horizontal';

@Component({
  selector: 'app-button-group-separator',
  standalone: true,
  template: '<span class="button-group-separator" [class.vertical]="orientation === \'vertical\'"></span>',
  styleUrl: './button-group-separator.component.scss',
})
export class ButtonGroupSeparatorComponent {
  @Input() orientation: ButtonGroupSeparatorOrientation = 'vertical';
}
