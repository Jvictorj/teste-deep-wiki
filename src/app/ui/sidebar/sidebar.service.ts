import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private readonly openSubject = new BehaviorSubject<boolean>(true);
  readonly open$ = this.openSubject.asObservable();

  toggle(): void {
    this.openSubject.next(!this.openSubject.value);
  }

  setOpen(open: boolean): void {
    this.openSubject.next(open);
  }
}
