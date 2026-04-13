import { Component } from '@angular/core';

@Component({
  selector: 'app-input-group-text',
  standalone: true,
  template: '<span class="input-group-text"><ng-content></ng-content></span>',
  styleUrl: './input-group-text.component.scss',
})
export class InputGroupTextComponent {}
