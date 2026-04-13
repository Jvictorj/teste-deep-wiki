import { Component } from '@angular/core';

@Component({
  selector: 'app-toggle-group-item',
  standalone: true,
  template: '<button class="toggle-group-item" type="button"><ng-content></ng-content></button>',
  styleUrl: './toggle-group-item.component.scss',
})
export class ToggleGroupItemComponent {}
