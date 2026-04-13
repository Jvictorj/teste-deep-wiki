import { Injectable } from '@angular/core';

export type AccordionType = 'single' | 'multiple';

@Injectable()
export class AccordionService {
  private type: AccordionType = 'single';
  private collapsible = false;
  private openValues = new Set<string>();

  configure(type: AccordionType, collapsible: boolean): void {
    this.type = type;
    this.collapsible = collapsible;
  }

  isOpen(value: string): boolean {
    return this.openValues.has(value);
  }

  toggle(value: string): void {
    if (this.type === 'single') {
      if (this.openValues.has(value)) {
        if (this.collapsible) {
          this.openValues.clear();
        }
      } else {
        this.openValues.clear();
        this.openValues.add(value);
      }
      return;
    }

    if (this.openValues.has(value)) {
      this.openValues.delete(value);
    } else {
      this.openValues.add(value);
    }
  }
}
