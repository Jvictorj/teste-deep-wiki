import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-field-separator',
  standalone: true,
  template: '<div class="field-separator"><span *ngIf="content">{{ content }}</span></div>',
  styleUrl: './field-separator.component.scss',
})
export class FieldSeparatorComponent {
  @Input() content?: string;
}
