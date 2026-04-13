import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumb-link',
  standalone: true,
  templateUrl: './breadcrumb-link.component.html',
  styleUrl: './breadcrumb-link.component.scss',
})
export class BreadcrumbLinkComponent {
  @Input() href = '#';
}
