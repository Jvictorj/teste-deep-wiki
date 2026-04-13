import { Component } from '@angular/core';

@Component({
  selector: 'app-table-footer',
  standalone: true,
  template: '<tfoot class="table-footer"><ng-content></ng-content></tfoot>',
  styleUrl: './table-footer.component.scss',
})
export class TableFooterComponent {}
