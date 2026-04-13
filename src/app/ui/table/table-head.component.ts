import { Component } from '@angular/core';

@Component({
  selector: 'app-table-head',
  standalone: true,
  template: '<th class="table-head"><ng-content></ng-content></th>',
  styleUrl: './table-head.component.scss',
})
export class TableHeadComponent {}
