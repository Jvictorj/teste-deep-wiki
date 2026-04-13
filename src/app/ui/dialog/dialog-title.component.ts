import { Component } from '@angular/core';

@Component({
  selector: 'app-dialog-title',
  standalone: true,
  template: '<h3 class="dialog-title"><ng-content></ng-content></h3>',
  styleUrl: './dialog-title.component.scss',
})
export class DialogTitleComponent {}
