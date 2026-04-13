import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastConfig {
  title?: string;
  description?: string;
  duration?: number;
  action?: ToastAction;
}

export interface ToastItem extends ToastConfig {
  id: string;
  open: boolean;
}

const TOAST_LIMIT = 1;
const TOAST_DEFAULT_DURATION = 5000;
const TOAST_REMOVE_DELAY = 220;

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastsSubject = new BehaviorSubject<ToastItem[]>([]);
  readonly toasts$ = this.toastsSubject.asObservable();
  private count = 0;
  private removeTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
  private dismissTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

  show(config: ToastConfig): ToastItem {
    const id = this.nextId();
    const toast: ToastItem = {
      ...config,
      id,
      open: true,
    };

    const current = this.toastsSubject.value;
    const next = [toast, ...current].slice(0, TOAST_LIMIT);
    const removed = current.slice(Math.max(0, TOAST_LIMIT - 1));

    removed.forEach((item) => this.clearTimeouts(item.id));
    this.toastsSubject.next(next);
    this.queueDismiss(id, config.duration ?? TOAST_DEFAULT_DURATION);

    return toast;
  }

  update(id: string, config: Partial<ToastConfig>): void {
    const updated = this.toastsSubject.value.map((toast) =>
      toast.id === id ? { ...toast, ...config } : toast,
    );
    this.toastsSubject.next(updated);

    if (config.duration !== undefined) {
      this.queueDismiss(id, config.duration);
    }
  }

  dismiss(id?: string): void {
    const toasts = this.toastsSubject.value;
    if (id) {
      this.queueRemoval(id);
    } else {
      toasts.forEach((toast) => this.queueRemoval(toast.id));
    }

    this.toastsSubject.next(
      toasts.map((toast) =>
        id === undefined || toast.id === id ? { ...toast, open: false } : toast,
      ),
    );
  }

  remove(id?: string): void {
    if (id === undefined) {
      this.toastsSubject.value.forEach((toast) => this.clearTimeouts(toast.id));
      this.toastsSubject.next([]);
      return;
    }

    this.clearTimeouts(id);
    this.toastsSubject.next(this.toastsSubject.value.filter((toast) => toast.id !== id));
  }

  private nextId(): string {
    this.count = (this.count + 1) % Number.MAX_SAFE_INTEGER;
    return this.count.toString();
  }

  private queueRemoval(id: string): void {
    if (this.removeTimeouts.has(id)) return;

    const timeout = setTimeout(() => {
      this.removeTimeouts.delete(id);
      this.remove(id);
    }, TOAST_REMOVE_DELAY);

    this.removeTimeouts.set(id, timeout);
  }

  private queueDismiss(id: string, duration: number): void {
    this.clearDismissTimeout(id);

    const timeout = setTimeout(() => {
      this.dismiss(id);
    }, Math.max(duration, 0));

    this.dismissTimeouts.set(id, timeout);
  }

  private clearTimeouts(id: string): void {
    this.clearDismissTimeout(id);
    this.clearRemoveTimeout(id);
  }

  private clearDismissTimeout(id: string): void {
    const timeout = this.dismissTimeouts.get(id);
    if (!timeout) return;

    clearTimeout(timeout);
    this.dismissTimeouts.delete(id);
  }

  private clearRemoveTimeout(id: string): void {
    const timeout = this.removeTimeouts.get(id);
    if (!timeout) return;

    clearTimeout(timeout);
    this.removeTimeouts.delete(id);
  }
}
