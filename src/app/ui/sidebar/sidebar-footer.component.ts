import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-footer',
  standalone: true,
  template: '<div class="sidebar-footer"><ng-content></ng-content></div>',
  styleUrl: './sidebar-footer.component.scss',
})
export class SidebarFooterComponent {}
