import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabs',
  standalone: true,
  template: '<div class="tabs"><ng-content></ng-content></div>',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  @Input() active = '';
}
