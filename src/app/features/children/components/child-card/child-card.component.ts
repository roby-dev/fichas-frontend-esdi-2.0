import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Child } from '../../interfaces/child.interface';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-child-card',
  imports: [DatePipe, NgClass],
  templateUrl: './child-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildCardComponent {
  child = input.required<Child>();

  get fullName(): string {
    return `${this.child().firstName} ${this.child().lastName}`;
  }

  get statusLabel(): string {
    if (this.child().isGraduated) return 'Egreso disponible';
    if (this.child().isCurrentlyAdmitted) return 'Ingreso disponible';
    return 'No aplicable';
  }

  get statusColor(): string {
    if (!this.child().isGraduated && !this.child().isCurrentlyAdmitted) return 'red';
    return 'blue';
  }
}
