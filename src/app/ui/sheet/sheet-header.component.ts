import { Component } from '@angular/core';

@Component({
  selector: 'app-sheet-header',
  standalone: true,
  template: '<div class="sheet-header"><ng-content></ng-content></div>',
  styleUrl: './sheet-header.component.scss',
})
export class SheetHeaderComponent {}
