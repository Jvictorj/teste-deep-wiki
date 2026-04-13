import { Component } from '@angular/core';

@Component({
  selector: 'app-label',
  standalone: true,
  template: '<label class="label"><ng-content></ng-content></label>',
  styleUrl: './label.component.scss',
})
export class LabelComponent {}
