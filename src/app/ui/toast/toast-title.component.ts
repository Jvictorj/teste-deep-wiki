import { Component } from '@angular/core';

@Component({
  selector: 'app-toast-title',
  standalone: true,
  template: '<div class="toast-title"><ng-content></ng-content></div>',
  styleUrl: './toast-title.component.scss',
})
export class ToastTitleComponent {}
