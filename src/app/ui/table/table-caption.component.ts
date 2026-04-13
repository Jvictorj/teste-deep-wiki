import { Component } from '@angular/core';

@Component({
  selector: 'app-table-caption',
  standalone: true,
  template: '<caption class="table-caption"><ng-content></ng-content></caption>',
  styleUrl: './table-caption.component.scss',
})
export class TableCaptionComponent {}
