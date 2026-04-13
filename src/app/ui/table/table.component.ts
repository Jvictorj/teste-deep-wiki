import { Component } from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  template: '<div class="table-container"><table class="table"><ng-content></ng-content></table></div>',
  styleUrl: './table.component.scss',
})
export class TableComponent {}
