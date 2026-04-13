import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-command-item',
  standalone: true,
  templateUrl: './command-item.component.html',
  styleUrl: './command-item.component.scss',
})
export class CommandItemComponent {
  @Input() disabled = false;
}
