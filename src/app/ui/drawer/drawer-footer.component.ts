import { Component } from '@angular/core';

@Component({
  selector: 'app-drawer-footer',
  standalone: true,
  template: '<div class="drawer-footer"><ng-content></ng-content></div>',
  styleUrl: './drawer-footer.component.scss',
})
export class DrawerFooterComponent {}
