import { Component } from '@angular/core';

@Component({
  selector: 'app-sheet-footer',
  standalone: true,
  template: '<div class="sheet-footer"><ng-content></ng-content></div>',
  styleUrl: './sheet-footer.component.scss',
})
export class SheetFooterComponent {}
