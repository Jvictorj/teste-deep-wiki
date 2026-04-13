import { Component } from '@angular/core';

@Component({
  selector: 'app-dropdown-menu-label',
  standalone: true,
  template: '<div class="dropdown-label"><ng-content></ng-content></div>',
  styleUrl: './dropdown-menu-label.component.scss',
})
export class DropdownMenuLabelComponent {}
