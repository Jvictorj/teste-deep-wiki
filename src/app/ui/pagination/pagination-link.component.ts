import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pagination-link',
  standalone: true,
  template: '<a class="pagination-link" [class.active]="isActive"><ng-content></ng-content></a>',
  styleUrl: './pagination-link.component.scss',
})
export class PaginationLinkComponent {
  @Input() isActive = false;
}
