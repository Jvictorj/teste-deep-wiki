import { Component } from '@angular/core';

@Component({
  selector: 'app-alert-dialog-title',
  standalone: true,
  template: '<h3 class="alert-title"><ng-content></ng-content></h3>',
  styleUrl: './alert-dialog-title.component.scss',
})
export class AlertDialogTitleComponent {}
