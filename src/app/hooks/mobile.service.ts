import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, fromEvent, Subscription } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';

const MOBILE_BREAKPOINT = 768;

@Injectable({
  providedIn: 'root',
})
export class MobileService implements OnDestroy {
  private readonly isMobileSubject = new BehaviorSubject<boolean>(false);
  readonly isMobile$ = this.isMobileSubject.asObservable();
  private subscription: Subscription;

  constructor() {
    this.subscription = fromEvent(window, 'resize')
      .pipe(
        startWith(null),
        debounceTime(100),
      )
      .subscribe(() => {
        this.isMobileSubject.next(window.innerWidth < MOBILE_BREAKPOINT);
      });
  }

  get isMobile(): boolean {
    return this.isMobileSubject.value;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
