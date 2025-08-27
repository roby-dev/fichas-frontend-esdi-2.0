import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Snackbar } from './snackbar.model';
import { SnackbarService } from './snackbar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-snackbar',
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnackbarComponent {
  private svc = inject(SnackbarService);
  positions = ['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center'] as const;

  positionClasses: Record<string, string> = {
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
    'top-center': 'top-6 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-0 left-6',
    'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
  };

  typeClasses: Record<string, string> = {
    success: 'border-l-4 border-green-500',
    error: 'border-l-4 border-red-500',
    info: 'border-l-4 border-blue-500',
    warn: 'border-l-4 border-amber-500',
  };

  snackbars = this.svc.snackbars;
  snackbarsByPosition = (pos: string) => computed(() => this.snackbars().filter((s: Snackbar) => s.position === pos));

  close(id: string) {
    this.svc.remove(id);
  }

  action(s: Snackbar) {
    try {
      s.onAction?.();
    } finally {
      this.close(s.id);
    }
  }

  capitalize(v: string) {
    return v ? v[0].toUpperCase() + v.slice(1) : v;
  }
}
