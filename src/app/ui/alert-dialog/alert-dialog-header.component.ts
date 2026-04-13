import { Component } from '@angular/core';

@Component({
  selector: 'app-alert-dialog-header',
  standalone: true,
  template: '<div class="alert-header"><ng-content></ng-content></div>',
  styleUrl: './alert-dialog-header.component.scss',
})
export class AlertDialogHeaderComponent {}
