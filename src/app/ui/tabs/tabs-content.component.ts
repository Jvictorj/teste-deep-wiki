import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs-content',
  standalone: true,
  template: '<div class="tabs-content"><ng-content></ng-content></div>',
  styleUrl: './tabs-content.component.scss',
})
export class TabsContentComponent {}
