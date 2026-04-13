import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-resizable-handle',
  standalone: true,
  template: '<div class="resizable-handle" [class.vertical]="orientation === \'vertical\'" resizableHandle [orientation]="orientation"><div class="handle-grip"></div></div>',
  styleUrl: './resizable-handle.component.scss',
})
export class ResizableHandleComponent {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
}
