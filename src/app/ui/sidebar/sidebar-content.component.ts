import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-content',
  standalone: true,
  template: '<div class="sidebar-content"><ng-content></ng-content></div>',
  styleUrl: './sidebar-content.component.scss',
})
export class SidebarContentComponent {}
