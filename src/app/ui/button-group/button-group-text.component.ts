import { Component } from '@angular/core';

@Component({
  selector: 'app-button-group-text',
  standalone: true,
  template: '<div class="button-group-text"><ng-content></ng-content></div>',
  styleUrl: './button-group-text.component.scss',
})
export class ButtonGroupTextComponent {}
