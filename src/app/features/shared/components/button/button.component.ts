import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  action = output<void | null>();
  label = input.required<string>();
  outline = input<boolean>(false);
  disabled = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');

  classes = computed(() => {
    return [
      'cursor-pointer',
      'rounded-lg',
      'border-1',
      'px-4',
      'py-2',
      'text-sm',
      'font-medium',
      'disabled:opacity-50',
      'transition-all duration-[150ms]',
      this.outline()
        ? 'bg-white text-blue-500 border-blue-500 hover:brightness-90'
        : 'bg-blue-500 text-white border-blue-500 hover:brightness-90',
    ].join(' ');
  });

  callAction() {
    if (this.action) {
      this.action.emit();
    }
  }
}
