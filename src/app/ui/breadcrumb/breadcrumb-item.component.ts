import { Component } from '@angular/core';

@Component({
  selector: 'app-breadcrumb-item',
  standalone: true,
  template: '<li class="breadcrumb-item"><ng-content></ng-content></li>',
  styleUrl: './breadcrumb-item.component.scss',
})
export class BreadcrumbItemComponent {}
