import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation-menu-content',
  standalone: true,
  template: '<div class="nav-content"><ng-content></ng-content></div>',
  styleUrl: './navigation-menu-content.component.scss',
})
export class NavigationMenuContentComponent {}
