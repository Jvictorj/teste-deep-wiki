import { Component } from '@angular/core';

@Component({
  selector: 'app-drawer-header',
  standalone: true,
  template: '<div class="drawer-header"><ng-content></ng-content></div>',
  styleUrl: './drawer-header.component.scss',
})
export class DrawerHeaderComponent {}
