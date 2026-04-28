import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormField } from '@angular/forms/signals';

@Component({
  standalone: true,
  selector: 'app-input',
  imports: [NgClass, FormField],
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  label = input<string>('');
  id = input<string>('');
  type = input<'text' | 'password' | 'email' | 'number' | 'date'>('text');
  placeholder = input<string>('');
  control = input.required<any>();
}


