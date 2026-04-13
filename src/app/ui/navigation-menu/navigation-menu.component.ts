import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  template: '<nav class="navigation-menu"><ng-content></ng-content></nav>',
  styleUrl: './navigation-menu.component.scss',
})
export class NavigationMenuComponent {}
