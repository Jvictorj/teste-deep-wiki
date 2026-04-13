import { Component } from '@angular/core';

@Component({
  selector: 'app-field-group',
  standalone: true,
  template: '<div class="field-group"><ng-content></ng-content></div>',
  styleUrl: './field-group.component.scss',
})
export class FieldGroupComponent {}
