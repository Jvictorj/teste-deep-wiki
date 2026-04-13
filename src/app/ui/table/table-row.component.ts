import { Component } from '@angular/core';

@Component({
  selector: 'app-table-row',
  standalone: true,
  template: '<tr class="table-row"><ng-content></ng-content></tr>',
  styleUrl: './table-row.component.scss',
})
export class TableRowComponent {}
