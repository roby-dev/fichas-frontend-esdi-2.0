import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { ButtonComponent } from '@/features/shared/components/button/button.component';
import { CommunityHall } from '@/features/community-halls/interfaces/community.interface';
import { CopyScheduleVersionRequest } from '../../../interfaces/caregiver-schedule.interface';

@Component({
  standalone: true,
  selector: 'app-schedule-copy-modal',
  imports: [ButtonComponent],
  templateUrl: './schedule-copy-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleCopyModalComponent {
  halls = input.required<CommunityHall[]>();
  isLoading = input(false);
  copy = output<CopyScheduleVersionRequest>();

  targetHallId = signal('');
  validFrom = signal('');
  name = signal('');

  isInvalid = computed(() => !this.targetHallId() || !this.validFrom() || !this.name().trim());

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.isInvalid()) return;

    this.copy.emit({
      targetHallId: this.targetHallId(),
      validFrom: this.validFrom(),
      name: this.name().trim(),
    });
  }
}
