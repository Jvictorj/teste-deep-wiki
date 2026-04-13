import { Component } from '@angular/core';

@Component({
  selector: 'app-pagination-next',
  standalone: true,
  template: '<a class="pagination-control" aria-label="Go to next page"><ng-content></ng-content></a>',
  styleUrl: './pagination-control.component.scss',
})
export class PaginationNextComponent {}
