import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-otp',
  standalone: true,
  templateUrl: './input-otp.component.html',
  styleUrl: './input-otp.component.scss',
})
export class InputOtpComponent {
  @Input() length = 6;
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  onInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const chars = this.value.split('');
    chars[index] = input.value.slice(-1);
    this.value = chars.join('');
    this.valueChange.emit(this.value);
  }
}
