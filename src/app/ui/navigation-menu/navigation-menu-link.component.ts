import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation-menu-link',
  standalone: true,
  template: '<a class="nav-link" href="#"><ng-content></ng-content></a>',
  styleUrl: './navigation-menu-link.component.scss',
})
export class NavigationMenuLinkComponent {}
