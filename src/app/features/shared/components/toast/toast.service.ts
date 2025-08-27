import { Injectable, signal } from '@angular/core';
import { Toast, ToastOptions } from './models/toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  get toasts() {
    return this._toasts;
  }

  private makeId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }

  show(opts: ToastOptions) {
    const defaultOpts: Required<
      Pick<ToastOptions, 'id' | 'type' | 'title' | 'message' | 'duration' | 'closable' | 'position'>
    > = {
      id: opts.id ?? this.makeId(),
      type: opts.type ?? 'info',
      title: opts.title ?? '',
      message: opts.message,
      duration: opts.duration ?? 5000,
      closable: opts.closable ?? true,
      position: opts.position ?? 'top-right',
    };

    const toast: Toast = { ...defaultOpts };
    this._toasts.update((list) => [...list, toast]);

    if (toast.duration > 0) {
      setTimeout(() => this.remove(toast.id), toast.duration);
    }

    return toast.id;
  }

  success(message: string, title?: string, opts?: Partial<ToastOptions>) {
    return this.show({ ...opts, message, title: title ?? 'Éxito', type: 'success' });
  }
  error(message: string, title?: string, opts?: Partial<ToastOptions>) {
    return this.show({ ...opts, message, title: title ?? 'Error', type: 'error' });
  }
  info(message: string, title?: string, opts?: Partial<ToastOptions>) {
    return this.show({ ...opts, message, title: title ?? 'Info', type: 'info' });
  }
  warn(message: string, title?: string, opts?: Partial<ToastOptions>) {
    return this.show({ ...opts, message, title: title ?? 'Atención', type: 'warn' });
  }

  remove(id: string) {
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }

  clear() {
    this._toasts.set([]);
  }
}
