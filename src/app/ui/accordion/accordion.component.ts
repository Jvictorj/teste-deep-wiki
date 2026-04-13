import { Component, Input, OnChanges } from '@angular/core';
import { AccordionService, AccordionType } from './accordion.service';

@Component({
  selector: 'app-accordion',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [AccordionService],
})
export class AccordionComponent implements OnChanges {
  @Input() type: AccordionType = 'single';
  @Input() collapsible = false;

  constructor(private accordion: AccordionService) {}

  ngOnChanges(): void {
    this.accordion.configure(this.type, this.collapsible);
  }
}
