import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-collapsible',
  standalone: true,
  template: '<div class="collapsible"><ng-content></ng-content></div>',
})
export class CollapsibleComponent {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  toggle(): void {
    this.open = !this.open;
    this.openChange.emit(this.open);
  }
}
