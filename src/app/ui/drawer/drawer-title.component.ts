import { Component } from '@angular/core';

@Component({
  selector: 'app-drawer-title',
  standalone: true,
  template: '<div class="drawer-title"><ng-content></ng-content></div>',
  styleUrl: './drawer-title.component.scss',
})
export class DrawerTitleComponent {}
