import { Component } from '@angular/core';

@Component({
  selector: 'app-dialog-footer',
  standalone: true,
  template: '<div class="dialog-footer"><ng-content></ng-content></div>',
  styleUrl: './dialog-footer.component.scss',
})
export class DialogFooterComponent {}
