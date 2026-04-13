import { Component } from '@angular/core';

@Component({
  selector: 'app-table-header',
  standalone: true,
  template: '<thead class="table-header"><ng-content></ng-content></thead>',
  styleUrl: './table-header.component.scss',
})
export class TableHeaderComponent {}
