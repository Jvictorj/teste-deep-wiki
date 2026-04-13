import { Component, HostBinding, Input } from '@angular/core';

export type FieldLegendVariant = 'legend' | 'label';

@Component({
  selector: 'app-field-legend',
  standalone: true,
  template: '<legend class="field-legend"><ng-content></ng-content></legend>',
  styleUrl: './field-legend.component.scss',
})
export class FieldLegendComponent {
  @Input() variant: FieldLegendVariant = 'legend';

  @HostBinding('class')
  get classes(): string {
    return `field-legend ${this.variant}`;
  }
}
