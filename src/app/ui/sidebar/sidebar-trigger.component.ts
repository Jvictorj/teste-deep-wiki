import { Component } from '@angular/core';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar-trigger',
  standalone: true,
  template: '<button class="sidebar-trigger" type="button" (click)="sidebar.toggle()"><ng-content></ng-content></button>',
  styleUrl: './sidebar-trigger.component.scss',
})
export class SidebarTriggerComponent {
  constructor(public sidebar: SidebarService) {}
}
