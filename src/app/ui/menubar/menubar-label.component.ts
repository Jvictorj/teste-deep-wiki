import { Component } from '@angular/core';

@Component({
  selector: 'app-menubar-label',
  standalone: true,
  template: '<div class="menubar-label"><ng-content></ng-content></div>',
  styleUrl: './menubar-label.component.scss',
})
export class MenubarLabelComponent {}
