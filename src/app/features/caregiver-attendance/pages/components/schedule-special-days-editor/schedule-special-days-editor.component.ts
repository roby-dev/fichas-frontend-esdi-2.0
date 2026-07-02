import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ScheduleBlock, SpecialDay } from '../../../interfaces/caregiver-schedule.interface';

@Component({
  standalone: true,
  selector: 'app-schedule-special-days-editor',
  imports: [],
  templateUrl: './schedule-special-days-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleSpecialDaysEditorComponent {
  specialDays = input.required<SpecialDay[]>();
  blocks = input.required<ScheduleBlock[]>();
  specialDaysChange = output<SpecialDay[]>();

  addSpecialDay(): void {
    this.specialDaysChange.emit([...this.specialDays(), { localDate: '', isWorkingDay: false, blockIds: [] }]);
  }

  removeSpecialDay(index: number): void {
    this.specialDaysChange.emit(this.specialDays().filter((_, currentIndex) => currentIndex !== index));
  }

  updateSpecialDay(index: number, patch: Partial<SpecialDay>): void {
    this.specialDaysChange.emit(this.specialDays().map((day, currentIndex) => {
      return currentIndex === index ? { ...day, ...patch } : day;
    }));
  }

  selectedBlockIds(select: HTMLSelectElement): string[] {
    return Array.from(select.selectedOptions).map((option) => option.value);
  }
}
