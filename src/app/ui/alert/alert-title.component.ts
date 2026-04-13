import { Component } from '@angular/core';

@Component({
  selector: 'app-alert-title',
  standalone: true,
  template: '<div class="alert-title"><ng-content></ng-content></div>',
  styleUrl: './alert-title.component.scss',
})
export class AlertTitleComponent {}
