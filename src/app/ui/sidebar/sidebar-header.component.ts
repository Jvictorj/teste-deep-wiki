import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-header',
  standalone: true,
  template: '<div class="sidebar-header"><ng-content></ng-content></div>',
  styleUrl: './sidebar-header.component.scss',
})
export class SidebarHeaderComponent {}
