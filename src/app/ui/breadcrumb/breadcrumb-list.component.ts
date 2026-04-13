import { Component } from '@angular/core';

@Component({
  selector: 'app-breadcrumb-list',
  standalone: true,
  template: '<ol class="breadcrumb-list"><ng-content></ng-content></ol>',
  styleUrl: './breadcrumb-list.component.scss',
})
export class BreadcrumbListComponent {}
