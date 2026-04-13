import { Component } from '@angular/core';

@Component({
  selector: 'app-pagination-content',
  standalone: true,
  template: '<ul class="pagination-content"><ng-content></ng-content></ul>',
  styleUrl: './pagination-content.component.scss',
})
export class PaginationContentComponent {}
