import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  title = input<string>('');
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  closeOnOverlayClick = input<boolean>(true);

  closed = output<void>();
  opened = output<void>();

  sizeClasses = computed(() => {
    switch (this.size()) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-3xl';
      case 'xl':
        return 'max-w-5xl';
      default:
        return 'max-w-md';
    }
  });

  // constructor() {
  //   effect(() => {
  //     if (this.isOpen()) {
  //       this.opened.emit();
  //     }
  //   });
  // }

  close() {
    this.closed.emit();
  }
}
