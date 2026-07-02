import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DayRule, ScheduleBlock } from '../../../interfaces/caregiver-schedule.interface';

@Component({
  standalone: true,
  selector: 'app-schedule-day-rules-editor',
  imports: [],
  templateUrl: './schedule-day-rules-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleDayRulesEditorComponent {
  dayRules = input.required<DayRule[]>();
  blocks = input.required<ScheduleBlock[]>();
  dayRulesChange = output<DayRule[]>();

  readonly dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  readonly blockIds = computed(() => this.blocks().map((block) => block.id).filter((id): id is string => Boolean(id)));

  updateRule(index: number, patch: Partial<DayRule>): void {
    this.dayRulesChange.emit(this.dayRules().map((rule, currentIndex) => {
      return currentIndex === index ? { ...rule, ...patch } : rule;
    }));
  }

  applyPreset(preset: 'weekdays' | 'all' | 'none'): void {
    const isWorking = (dayOfWeek: number) => {
      if (preset === 'all') return true;
      if (preset === 'none') return false;
      return dayOfWeek > 0 && dayOfWeek < 6;
    };
    this.dayRulesChange.emit(this.dayRules().map((rule) => ({ ...rule, isWorkingDay: isWorking(rule.dayOfWeek) })));
  }

  replicateBlocksToAllWorkingDays(): void {
    const blockIds = this.blockIds();
    if (blockIds.length === 0) return;
    this.dayRulesChange.emit(this.dayRules().map((rule) => ({
      ...rule,
      blockIds: rule.isWorkingDay ? [...blockIds] : rule.blockIds,
    })));
  }

  selectedBlockIds(select: HTMLSelectElement): string[] {
    return Array.from(select.selectedOptions).map((option) => option.value);
  }
}
