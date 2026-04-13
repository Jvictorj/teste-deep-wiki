import { Component } from '@angular/core';

@Component({
  selector: 'app-pagination-item',
  standalone: true,
  template: '<li class="pagination-item"><ng-content></ng-content></li>',
})
export class PaginationItemComponent {}
