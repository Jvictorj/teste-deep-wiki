import { Component, Input } from '@angular/core';
import { CollapsibleComponent } from './collapsible.component';

@Component({
  selector: 'app-collapsible-trigger',
  standalone: true,
  template: '<button type="button" (click)="toggle()"><ng-content></ng-content></button>',
})
export class CollapsibleTriggerComponent {
  @Input() collapsible?: CollapsibleComponent;

  toggle(): void {
    this.collapsible?.toggle();
  }
}
