import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ScheduleBlock } from '../../../interfaces/caregiver-schedule.interface';

@Component({
  standalone: true,
  selector: 'app-schedule-blocks-editor',
  imports: [],
  templateUrl: './schedule-blocks-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleBlocksEditorComponent {
  blocks = input.required<ScheduleBlock[]>();
  blocksChange = output<ScheduleBlock[]>();

  addBlock(): void {
    this.blocksChange.emit([
      ...this.blocks(),
      {
        id: crypto.randomUUID(),
        name: '',
        entryTime: '',
        exitTime: '',
        exitRequired: false,
        toleranceMinutes: 10,
        markingWindowMinutes: 30,
      },
    ]);
  }

  removeBlock(index: number): void {
    this.blocksChange.emit(this.blocks().filter((_, currentIndex) => currentIndex !== index));
  }

  updateBlock(index: number, patch: Partial<ScheduleBlock>): void {
    this.blocksChange.emit(this.blocks().map((block, currentIndex) => {
      return currentIndex === index ? { ...block, ...patch } : block;
    }));
  }

  toNumber(value: string): number {
    return Number(value || 0);
  }
}
