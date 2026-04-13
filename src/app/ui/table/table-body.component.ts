import { Component } from '@angular/core';

@Component({
  selector: 'app-table-body',
  standalone: true,
  template: '<tbody class="table-body"><ng-content></ng-content></tbody>',
  styleUrl: './table-body.component.scss',
})
export class TableBodyComponent {}
