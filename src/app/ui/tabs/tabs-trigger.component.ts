import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabs-trigger',
  standalone: true,
  template: '<button class="tabs-trigger" type="button"><ng-content></ng-content></button>',
  styleUrl: './tabs-trigger.component.scss',
})
export class TabsTriggerComponent {
  @Input() active = false;
}
