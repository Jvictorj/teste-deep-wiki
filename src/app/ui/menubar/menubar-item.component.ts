import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-menubar-item',
  standalone: true,
  template: '<div class="menubar-item" [class.destructive]="variant === \'destructive\'"><ng-content></ng-content></div>',
  styleUrl: './menubar-item.component.scss',
})
export class MenubarItemComponent {
  @Input() variant: 'default' | 'destructive' = 'default';
}
