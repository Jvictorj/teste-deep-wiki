import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-menubar-trigger',
  standalone: true,
  template: '<button class="menubar-trigger" type="button"><ng-content></ng-content></button>',
  styleUrl: './menubar-trigger.component.scss',
})
export class MenubarTriggerComponent {}
