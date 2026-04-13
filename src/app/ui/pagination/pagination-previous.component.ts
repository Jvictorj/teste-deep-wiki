import { Component } from '@angular/core';

@Component({
  selector: 'app-pagination-previous',
  standalone: true,
  template: '<a class="pagination-control" aria-label="Go to previous page"><ng-content></ng-content></a>',
  styleUrl: './pagination-control.component.scss',
})
export class PaginationPreviousComponent {}
