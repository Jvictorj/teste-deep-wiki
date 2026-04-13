import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-command-group',
  standalone: true,
  templateUrl: './command-group.component.html',
  styleUrl: './command-group.component.scss',
})
export class CommandGroupComponent {
  @Input() heading?: string;
}
