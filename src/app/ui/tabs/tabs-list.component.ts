import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs-list',
  standalone: true,
  template: '<div class="tabs-list"><ng-content></ng-content></div>',
  styleUrl: './tabs-list.component.scss',
})
export class TabsListComponent {}
