import { Component } from '@angular/core';

@Component({
  selector: 'app-toggle-group',
  standalone: true,
  template: '<div class="toggle-group"><ng-content></ng-content></div>',
  styleUrl: './toggle-group.component.scss',
})
export class ToggleGroupComponent {}
