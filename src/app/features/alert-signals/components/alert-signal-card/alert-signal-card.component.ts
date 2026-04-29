import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { AlertSignalChild } from '../../interfaces/alert-signal-child.interface';

@Component({
  selector: 'app-alert-signal-card',
  standalone: true,
  imports: [NgClass, DatePipe],
  templateUrl: './alert-signal-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertSignalCardComponent {
  child = input.required<AlertSignalChild>();

  isActive = computed(() => !!this.child().activeAlertSignal?.trim());

  borderClasses = computed(() => {
    if (!this.isActive()) return 'border-l-gray-200';
    const val = this.child().activeAlertSignal.toLowerCase();
    if (val.includes('desnutri') || val.includes('severa')) return 'border-l-red-400';
    if (val.includes('alerta')) return 'border-l-orange-400';
    if (val.includes('riesgo')) return 'border-l-yellow-400';
    if (val.includes('normal') || val.includes('adecuado')) return 'border-l-green-300';
    return 'border-l-blue-400';
  });

  signalBadgeClasses = computed(() => {
    if (!this.isActive()) return 'bg-gray-100 text-gray-500';
    const val = this.child().activeAlertSignal.toLowerCase();
    if (val.includes('desnutri') || val.includes('severa')) return 'bg-red-100 text-red-700';
    if (val.includes('alerta')) return 'bg-orange-100 text-orange-700';
    if (val.includes('riesgo')) return 'bg-yellow-100 text-yellow-700';
    if (val.includes('normal') || val.includes('adecuado')) return 'bg-green-100 text-green-700';
    return 'bg-blue-100 text-blue-700';
  });

  dotColor = computed(() => {
    if (!this.isActive()) return 'bg-gray-400';
    const val = this.child().activeAlertSignal.toLowerCase();
    if (val.includes('desnutri') || val.includes('severa')) return 'bg-red-500';
    if (val.includes('alerta')) return 'bg-orange-500';
    if (val.includes('riesgo')) return 'bg-yellow-500';
    if (val.includes('normal') || val.includes('adecuado')) return 'bg-green-500';
    return 'bg-blue-500';
  });

  genderIcon = computed(() => {
    const g = this.child().gender?.toUpperCase();
    return g === 'M' ? '♂' : g === 'F' ? '♀' : '';
  });

  ageLabel = computed(() => `${this.child().ageInMonths} meses`);
}
