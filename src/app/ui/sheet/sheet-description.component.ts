import { Component } from '@angular/core';

@Component({
  selector: 'app-sheet-description',
  standalone: true,
  template: '<div class="sheet-description"><ng-content></ng-content></div>',
  styleUrl: './sheet-description.component.scss',
})
export class SheetDescriptionComponent {}
