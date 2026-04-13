import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-menubar',
  standalone: true,
  template: '<div class="menubar"><ng-content></ng-content></div>',
  styleUrl: './menubar.component.scss',
})
export class MenubarComponent {}
