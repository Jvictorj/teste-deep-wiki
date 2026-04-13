import { A11yModule } from '@angular/cdk/a11y';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

export type SheetSide = 'left' | 'right' | 'top' | 'bottom';

@Component({
  selector: 'app-sheet',
  standalone: true,
  imports: [A11yModule],
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.scss',
})
export class SheetComponent implements OnChanges, AfterViewChecked, OnDestroy {
  @Input() open = false;
  @Input() side: SheetSide = 'right';
  @Input() panelId: string | null = null;
  @Input() ariaLabel = 'Painel lateral';
  @Input() ariaLabelledby: string | null = null;
  @Input() ariaDescribedby: string | null = null;
  @Input() closeButtonAriaLabel = 'Fechar painel';
  @Input() showCloseButton = true;
  @Output() openChange = new EventEmitter<boolean>();

  @ViewChild('sheetContent') private sheetContent?: ElementRef<HTMLElement>;

  private readonly isBrowser: boolean;
  private previousFocusedElement: HTMLElement | null = null;
  private previousBodyOverflow = '';
  private openStateApplied = false;
  private shouldFocusPanel = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  @HostBinding('class')
  get classes(): string {
    return `sheet-host ${this.side}`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']) {
      this.syncOpenState(this.open);
    }
  }

  ngAfterViewChecked(): void {
    if (!this.open || !this.shouldFocusPanel) {
      return;
    }

    const contentElement = this.sheetContent?.nativeElement;

    if (
      contentElement &&
      !contentElement.contains(this.document.activeElement)
    ) {
      contentElement.focus();
    }

    this.shouldFocusPanel = false;
  }

  ngOnDestroy(): void {
    this.syncOpenState(false);
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent): void {
    if (!this.open) {
      return;
    }

    event.preventDefault();
    this.close();
  }

  close(): void {
    if (!this.open) {
      return;
    }

    this.open = false;
    this.syncOpenState(false);
    this.openChange.emit(false);
  }

  private syncOpenState(isOpen: boolean): void {
    if (!this.isBrowser) {
      return;
    }

    if (isOpen) {
      if (this.openStateApplied) {
        return;
      }

      this.previousFocusedElement =
        this.document.activeElement instanceof HTMLElement
          ? this.document.activeElement
          : null;
      this.previousBodyOverflow = this.document.body.style.overflow;
      this.document.body.style.overflow = 'hidden';
      this.openStateApplied = true;
      this.shouldFocusPanel = true;
      return;
    }

    if (!this.openStateApplied) {
      return;
    }

    this.document.body.style.overflow = this.previousBodyOverflow;
    this.openStateApplied = false;
    this.shouldFocusPanel = false;
    this.restoreFocus();
  }

  private restoreFocus(): void {
    if (!this.previousFocusedElement?.isConnected) {
      this.previousFocusedElement = null;
      return;
    }

    this.previousFocusedElement.focus();
    this.previousFocusedElement = null;
  }
}
