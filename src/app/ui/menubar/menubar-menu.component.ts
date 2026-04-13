import { Component } from '@angular/core';

@Component({
  selector: 'app-menubar-menu',
  standalone: true,
  template: '<div class="menubar-menu"><ng-content></ng-content></div>',
})
export class MenubarMenuComponent {}
