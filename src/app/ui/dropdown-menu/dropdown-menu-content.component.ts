import { Component } from '@angular/core';

@Component({
  selector: 'app-dropdown-menu-content',
  standalone: true,
  template: '<div class="dropdown-content"><ng-content></ng-content></div>',
  styleUrl: './dropdown-menu-content.component.scss',
})
export class DropdownMenuContentComponent {}
