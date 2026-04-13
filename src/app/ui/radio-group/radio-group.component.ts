import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-radio-group',
  standalone: true,
  template: '<div class="radio-group"><ng-content></ng-content></div>',
  styleUrl: './radio-group.component.scss',
})
export class RadioGroupComponent {
  @Input() name = `radio-group-${Math.random().toString(36).slice(2)}`;
}
