import { Component } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  template: '<nav aria-label="breadcrumb"><ng-content></ng-content></nav>',
})
export class BreadcrumbComponent {}
