import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ToastItem, ToastService } from '../../hooks/toast.service';

@Component({
  selector: 'app-toaster',
  standalone: true,
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.scss',
  imports: [CommonModule],
})
export class ToasterComponent {
  @Input() position: 'top-right' | 'bottom-right' = 'top-right';

  constructor(public toast: ToastService) {}

  dismiss(id: string): void {
    this.toast.dismiss(id);
  }

  runAction(item: ToastItem): void {
    item.action?.onClick();
    this.toast.dismiss(item.id);
  }
}
