import { Component } from '@angular/core';

@Component({
  selector: 'app-command-list',
  standalone: true,
  template: '<div class="command-list"><ng-content></ng-content></div>',
  styleUrl: './command-list.component.scss',
})
export class CommandListComponent {}
