import { Component } from '@angular/core';
import { AccordionItemComponent } from './accordion-item.component';
import { AccordionService } from './accordion.service';

@Component({
  selector: 'app-accordion-trigger',
  standalone: true,
  templateUrl: './accordion-trigger.component.html',
  styleUrl: './accordion-trigger.component.scss',
})
export class AccordionTriggerComponent {
  constructor(
    private item: AccordionItemComponent,
    private accordion: AccordionService,
  ) {}

  toggle(): void {
    this.accordion.toggle(this.item.value);
  }

  get isOpen(): boolean {
    return this.accordion.isOpen(this.item.value);
  }
}
