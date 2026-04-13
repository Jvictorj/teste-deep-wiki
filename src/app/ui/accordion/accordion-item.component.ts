import { Component, Input } from '@angular/core';
import { AccordionService } from './accordion.service';

@Component({
  selector: 'app-accordion-item',
  standalone: true,
  templateUrl: './accordion-item.component.html',
  styleUrl: './accordion-item.component.scss',
})
export class AccordionItemComponent {
  @Input({ required: true }) value!: string;

  constructor(private accordion: AccordionService) {}

  get isOpen(): boolean {
    return this.accordion.isOpen(this.value);
  }
}
