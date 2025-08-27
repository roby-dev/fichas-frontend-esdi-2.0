import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../toast.service';
import { Toast } from '../models/toast.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-host',
  imports: [CommonModule],
  templateUrl: './toast-host.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastHostComponent {
  private service = inject(ToastService);
  positions = ['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center'] as const;

  // position -> classes
  positionClasses: Record<string, string> = {
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
    'top-center': 'top-6 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  };

  // style per toast type
  typeClasses: Record<string, string> = {
    success: 'border-l-4 border-green-500',
    error: 'border-l-4 border-red-500',
    info: 'border-l-4 border-blue-500',
    warn: 'border-l-4 border-amber-500',
  };

  toastsByPosition = (pos: string) => {
    return () => this.service.toasts().filter((t: Toast) => t.position === pos);
  };

  close(id: string) {
    this.service.remove(id);
  }
}
