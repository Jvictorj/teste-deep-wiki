import { Component } from '@angular/core';

@Component({
  selector: 'app-kbd',
  standalone: true,
  template: '<kbd class="kbd"><ng-content></ng-content></kbd>',
  styleUrl: './kbd.component.scss',
})
export class KbdComponent {}
