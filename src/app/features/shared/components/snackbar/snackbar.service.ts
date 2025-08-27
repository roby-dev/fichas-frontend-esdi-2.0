// src/app/snackbar/snackbar.service.ts
import { Injectable, signal } from '@angular/core';
import { Snackbar, SnackbarOptions } from './snackbar.model';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private _snackbars = signal<Snackbar[]>([]);
  get snackbars() {
    return this._snackbars;
  }

  private timers = new Map<string, number>();

  private makeId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }

  show(opts: SnackbarOptions) {
    const defaultOpts: Required<
      Pick<SnackbarOptions, 'id' | 'type' | 'message' | 'actionText' | 'duration' | 'closable' | 'position'>
    > = {
      id: opts.id ?? this.makeId(),
      type: opts.type ?? 'info',
      message: opts.message,
      actionText: opts.actionText ?? '',
      duration: opts.duration ?? 5000,
      closable: opts.closable ?? true,
      position: opts.position ?? 'bottom-center',
    };

    const s: Snackbar = { ...defaultOpts, onAction: opts.onAction };
    this._snackbars.update((list) => [...list, s]);

    if (s.duration > 0) {
      const t = window.setTimeout(() => this.remove(s.id), s.duration);
      this.timers.set(s.id, t);
    }

    return s.id;
  }

  success(message: string, opts?: Partial<SnackbarOptions>) {
    return this.show({ ...opts, message, type: 'success' });
  }
  error(message: string, opts?: Partial<SnackbarOptions>) {
    return this.show({ ...opts, message, type: 'error' });
  }
  info(message: string, opts?: Partial<SnackbarOptions>) {
    return this.show({ ...opts, message, type: 'info' });
  }
  warn(message: string, opts?: Partial<SnackbarOptions>) {
    return this.show({ ...opts, message, type: 'warn' });
  }

  remove(id: string) {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this._snackbars.update((list) => list.filter((s) => s.id !== id));
  }

  clear() {
    for (const t of this.timers.values()) clearTimeout(t);
    this.timers.clear();
    this._snackbars.set([]);
  }
}
