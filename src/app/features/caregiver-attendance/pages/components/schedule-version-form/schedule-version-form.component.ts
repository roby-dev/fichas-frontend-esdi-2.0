import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { ButtonComponent } from '@/features/shared/components/button/button.component';
import { CommunityHall } from '@/features/community-halls/interfaces/community.interface';
import { CreateScheduleVersionRequest, DayRule, ScheduleBlock, SpecialDay } from '../../../interfaces/caregiver-schedule.interface';
import { CaregiverScheduleState } from '../../../states/caregiver-schedule.state';
import { ScheduleBlocksEditorComponent } from '../schedule-blocks-editor/schedule-blocks-editor.component';
import { ScheduleDayRulesEditorComponent } from '../schedule-day-rules-editor/schedule-day-rules-editor.component';
import { ScheduleSpecialDaysEditorComponent } from '../schedule-special-days-editor/schedule-special-days-editor.component';

@Component({
  standalone: true,
  selector: 'app-schedule-version-form',
  imports: [ButtonComponent, ScheduleBlocksEditorComponent, ScheduleDayRulesEditorComponent, ScheduleSpecialDaysEditorComponent],
  templateUrl: './schedule-version-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleVersionFormComponent {
  readonly scheduleState = inject(CaregiverScheduleState);

  halls = input.required<CommunityHall[]>();
  saved = output<void>();

  selectedHallId = signal('');
  name = signal('');
  validFrom = signal(this.todayString());
  validTo = signal('');
  blocks = signal<ScheduleBlock[]>([this.newBlock()]);
  dayRules = signal<DayRule[]>(Array.from({ length: 7 }, (_, dayOfWeek) => ({ dayOfWeek, isWorkingDay: dayOfWeek > 0 && dayOfWeek < 6, blockIds: [] })));
  specialDays = signal<SpecialDay[]>([]);
  submitError = signal<string | null>(null);
  activeTab = signal<'general' | 'bloques' | 'dias' | 'especiales'>('general');

  readonly tabs = [
    { id: 'general' as const, label: 'General', hint: 'Datos básicos' },
    { id: 'bloques' as const, label: 'Bloques', hint: 'Turnos de atención' },
    { id: 'dias' as const, label: 'Días de la semana', hint: 'Qué días se atiende' },
    { id: 'especiales' as const, label: 'Días especiales', hint: 'Feriados y excepciones' },
  ];

  setTab(tab: 'general' | 'bloques' | 'dias' | 'especiales'): void {
    this.activeTab.set(tab);
  }

  isInvalid = computed(() => {
    return !this.selectedHallId() || !this.name().trim() || !this.validFrom() || this.validBlocks().length === 0;
  });

  updateBlocks(blocks: ScheduleBlock[]): void {
    const validIds = new Set(blocks.map((block) => block.id).filter(Boolean));
    this.blocks.set(blocks);
    this.dayRules.update((rules) => rules.map((rule) => ({ ...rule, blockIds: rule.blockIds.filter((id) => validIds.has(id)) })));
    this.specialDays.update((days) => days.map((day) => ({ ...day, blockIds: day.blockIds.filter((id) => validIds.has(id)) })));
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.isInvalid()) return;

    const request = this.buildRequest();
    this.submitError.set(null);
    this.scheduleState.create(request).subscribe({
      next: () => this.saved.emit(),
      error: (err) => this.submitError.set(err?.message ?? 'No se pudo guardar el horario.'),
    });
  }

  buildRequest(): CreateScheduleVersionRequest {
    const validBlockIds = new Set(this.validBlocks().map((block) => block.id!));

    return {
      communityHallId: this.selectedHallId(),
      name: this.name().trim(),
      validFrom: this.validFrom(),
      validTo: this.optional(this.validTo()),
      blocks: this.validBlocks(),
      dayRules: this.dayRules().map((rule) => ({
        ...rule,
        blockIds: rule.blockIds.filter((id) => validBlockIds.has(id)),
      })),
      specialDays: this.specialDays()
        .filter((day) => day.localDate)
        .map((day) => ({ ...day, blockIds: day.blockIds.filter((id) => validBlockIds.has(id)) })),
    };
  }

  private validBlocks(): ScheduleBlock[] {
    return this.blocks()
      .filter((block) => block.name.trim() && block.entryTime)
      .map((block) => ({
        ...block,
        id: block.id ?? crypto.randomUUID(),
        name: block.name.trim(),
        exitTime: this.optional(block.exitTime ?? ''),
      }));
  }

  private newBlock(): ScheduleBlock {
    return {
      id: crypto.randomUUID(),
      name: '',
      entryTime: '',
      exitTime: '',
      exitRequired: false,
      toleranceMinutes: 10,
      markingWindowMinutes: 30,
    };
  }

  private optional(value: string): string | undefined {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }

  private todayString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
