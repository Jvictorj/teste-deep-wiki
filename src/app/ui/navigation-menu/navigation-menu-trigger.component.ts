import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation-menu-trigger',
  standalone: true,
  template: '<button class="nav-trigger" type="button"><ng-content></ng-content></button>',
  styleUrl: './navigation-menu-trigger.component.scss',
})
export class NavigationMenuTriggerComponent {}
