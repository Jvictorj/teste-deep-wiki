import { Component } from '@angular/core';

@Component({
  selector: 'app-sheet-title',
  standalone: true,
  template: '<div class="sheet-title"><ng-content></ng-content></div>',
  styleUrl: './sheet-title.component.scss',
})
export class SheetTitleComponent {}
