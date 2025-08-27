// src/app/toast/toast.model.ts
export type ToastType = 'success' | 'error' | 'info' | 'warn';

export interface ToastOptions {
  id?: string;
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number; // ms. 0 => persist until closed
  closable?: boolean;
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';
}

export interface Toast
  extends Required<Pick<ToastOptions, 'id' | 'type' | 'title' | 'message' | 'duration' | 'closable' | 'position'>> {}
