import { Component } from '@angular/core';

@Component({
  selector: 'app-breadcrumb-page',
  standalone: true,
  template: '<span class="breadcrumb-page" aria-current="page"><ng-content></ng-content></span>',
  styleUrl: './breadcrumb-page.component.scss',
})
export class BreadcrumbPageComponent {}
