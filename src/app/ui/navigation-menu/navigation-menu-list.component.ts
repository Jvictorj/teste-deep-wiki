import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation-menu-list',
  standalone: true,
  template: '<ul class="navigation-menu-list"><ng-content></ng-content></ul>',
  styleUrl: './navigation-menu-list.component.scss',
})
export class NavigationMenuListComponent {}
