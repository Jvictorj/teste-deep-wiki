import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-breadcrumb-separator',
  standalone: true,
  imports: [MatIconModule],
  template: '<li class="breadcrumb-separator" aria-hidden="true"><mat-icon>chevron_right</mat-icon></li>',
  styleUrl: './breadcrumb-separator.component.scss',
})
export class BreadcrumbSeparatorComponent {}


