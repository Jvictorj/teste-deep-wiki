import { Component } from '@angular/core';

@Component({
  selector: 'app-alert-dialog-footer',
  standalone: true,
  template: '<div class="alert-footer"><ng-content></ng-content></div>',
  styleUrl: './alert-dialog-footer.component.scss',
})
export class AlertDialogFooterComponent {}
