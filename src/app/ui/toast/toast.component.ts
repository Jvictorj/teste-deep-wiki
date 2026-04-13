import { Component, HostBinding, Input } from '@angular/core';

export type ToastVariant = 'default' | 'destructive';

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  @Input() variant: ToastVariant = 'default';

  @HostBinding('class')
  get classes(): string {
    return `toast ${this.variant}`;
  }
}
