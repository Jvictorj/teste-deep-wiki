import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-field-error',
  standalone: true,
  template: '<div class="field-error" role="alert"><ng-content></ng-content></div>',
  styleUrl: './field-error.component.scss',
})
export class FieldErrorComponent {
  @Input() message?: string;
}
