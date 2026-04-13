import { Component } from '@angular/core';

@Component({
  selector: 'app-pagination-ellipsis',
  standalone: true,
  template: '<span class="pagination-ellipsis"><ng-content></ng-content></span>',
  styleUrl: './pagination-ellipsis.component.scss',
})
export class PaginationEllipsisComponent {}
