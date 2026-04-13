import { Component } from '@angular/core';

@Component({
  selector: 'app-field-content',
  standalone: true,
  template: '<div class="field-content"><ng-content></ng-content></div>',
  styleUrl: './field-content.component.scss',
})
export class FieldContentComponent {}
