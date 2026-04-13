import { Component } from '@angular/core';

@Component({
  selector: 'app-dialog-header',
  standalone: true,
  template: '<div class="dialog-header"><ng-content></ng-content></div>',
  styleUrl: './dialog-header.component.scss',
})
export class DialogHeaderComponent {}
