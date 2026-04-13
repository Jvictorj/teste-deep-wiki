import { Component } from '@angular/core';

@Component({
  selector: 'app-form-item',
  standalone: true,
  template: '<div class="form-item"><ng-content></ng-content></div>',
  styleUrl: './form-item.component.scss',
})
export class FormItemComponent {}
