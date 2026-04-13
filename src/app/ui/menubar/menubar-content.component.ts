import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-menubar-content',
  standalone: true,
  template: '<div class="menubar-content"><ng-content></ng-content></div>',
  styleUrl: './menubar-content.component.scss',
})
export class MenubarContentComponent {}
