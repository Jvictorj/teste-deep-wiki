import { Component } from '@angular/core';

@Component({
  selector: 'app-command-empty',
  standalone: true,
  template: '<div class="command-empty"><ng-content></ng-content></div>',
  styleUrl: './command-empty.component.scss',
})
export class CommandEmptyComponent {}
