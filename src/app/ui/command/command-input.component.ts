import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-command-input',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './command-input.component.html',
  styleUrl: './command-input.component.scss',
})
export class CommandInputComponent {
  @Output() valueChange = new EventEmitter<string>();

  onInput(value: string): void {
    this.valueChange.emit(value);
  }
}


