import { Component } from '@angular/core';

@Component({
  selector: 'app-drawer-description',
  standalone: true,
  template: '<div class="drawer-description"><ng-content></ng-content></div>',
  styleUrl: './drawer-description.component.scss',
})
export class DrawerDescriptionComponent {}
