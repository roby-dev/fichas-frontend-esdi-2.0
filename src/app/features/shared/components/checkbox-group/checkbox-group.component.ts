import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

export interface CheckboxOption {
  value: string;
  label: string;
}

@Component({
  standalone: true,
  selector: 'app-checkbox-group',
  imports: [NgClass],
  templateUrl: './checkbox-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxGroupComponent {
  label = input<string>('');
  options = input.required<CheckboxOption[]>();
  selected = input<string[]>([]);
  selectedChange = output<string[]>();

  isSelected(value: string): boolean {
    return this.selected().includes(value);
  }

  toggle(value: string): void {
    const current = this.selected();
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    this.selectedChange.emit(updated);
  }
}
