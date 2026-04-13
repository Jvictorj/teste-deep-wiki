import { Component } from '@angular/core';

@Component({
  selector: 'app-kbd-group',
  standalone: true,
  template: '<div class="kbd-group"><ng-content></ng-content></div>',
  styleUrl: './kbd-group.component.scss',
})
export class KbdGroupComponent {}
