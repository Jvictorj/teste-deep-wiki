import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation-menu-item',
  standalone: true,
  template: '<li class="navigation-menu-item"><ng-content></ng-content></li>',
  styleUrl: './navigation-menu-item.component.scss',
})
export class NavigationMenuItemComponent {}
