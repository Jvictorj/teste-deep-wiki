import { Component, Input } from '@angular/core';

export type ResizableOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'app-resizable-panel-group',
  standalone: true,
  template: '<div class="resizable-group" [class.vertical]="orientation === \'vertical\'"><ng-content></ng-content></div>',
  styleUrl: './resizable-panel-group.component.scss',
})
export class ResizablePanelGroupComponent {
  @Input() orientation: ResizableOrientation = 'horizontal';
}
