import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-resizable-panel',
  standalone: true,
  template: '<div class="resizable-panel"><ng-content></ng-content></div>',
  styleUrl: './resizable-panel.component.scss',
})
export class ResizablePanelComponent {
  @HostBinding('style.flex')
  flex = '1 1 0';
}
