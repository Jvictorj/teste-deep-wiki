import { Component } from '@angular/core';

@Component({
  selector: 'app-command',
  standalone: true,
  template: '<div class="command"><ng-content></ng-content></div>',
  styleUrl: './command.component.scss',
})
export class CommandComponent {}
