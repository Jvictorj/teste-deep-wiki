import { Component } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: '<nav class="pagination" aria-label="pagination"><ng-content></ng-content></nav>',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {}
