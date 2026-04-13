import { Component, Input } from '@angular/core';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar-provider',
  standalone: true,
  template: '<div class="sidebar-wrapper"><ng-content></ng-content></div>',
  styleUrl: './sidebar-provider.component.scss',
})
export class SidebarProviderComponent {
  @Input() width = '16rem';
  @Input() widthCollapsed = '3rem';

  constructor(public sidebar: SidebarService) {}
}
