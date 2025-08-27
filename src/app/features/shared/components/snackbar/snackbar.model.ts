// src/app/snackbar/snackbar.model.ts
export type SnackbarType = 'success' | 'error' | 'info' | 'warn';

export interface SnackbarOptions {
  id?: string;
  type?: SnackbarType;
  message: string;
  actionText?: string;
  duration?: number; // ms, 0 = persist
  closable?: boolean;
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';
  onAction?: () => void;
}

export interface Snackbar
  extends Required<
    Pick<SnackbarOptions, 'id' | 'type' | 'message' | 'actionText' | 'duration' | 'closable' | 'position'>
  > {
  onAction?: () => void;
}
