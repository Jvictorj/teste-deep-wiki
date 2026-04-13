import { Component } from '@angular/core';

@Component({
  selector: 'app-table-cell',
  standalone: true,
  template: '<td class="table-cell"><ng-content></ng-content></td>',
  styleUrl: './table-cell.component.scss',
})
export class TableCellComponent {}
