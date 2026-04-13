import { Component, Input } from '@angular/core';
import { CollapsibleComponent } from './collapsible.component';

@Component({
  selector: 'app-collapsible-content',
  standalone: true,
  templateUrl: './collapsible-content.component.html',
  styleUrl: './collapsible-content.component.scss',
})
export class CollapsibleContentComponent {
  @Input() collapsible?: CollapsibleComponent;
}
