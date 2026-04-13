import { Component } from '@angular/core';
import { AccordionItemComponent } from './accordion-item.component';
import { AccordionService } from './accordion.service';

@Component({
  selector: 'app-accordion-content',
  standalone: true,
  templateUrl: './accordion-content.component.html',
  styleUrl: './accordion-content.component.scss',
})
export class AccordionContentComponent {
  constructor(
    private item: AccordionItemComponent,
    private accordion: AccordionService,
  ) {}

  get isOpen(): boolean {
    return this.accordion.isOpen(this.item.value);
  }
}
