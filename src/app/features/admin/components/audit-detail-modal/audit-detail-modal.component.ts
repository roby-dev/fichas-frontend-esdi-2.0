import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
import { AuditEvent } from '../../interfaces/audit-event.interface';

@Component({
  selector: 'app-audit-detail-modal',
  imports: [DatePipe, JsonPipe],
  templateUrl: './audit-detail-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditDetailModalComponent {
  event = input.required<AuditEvent>();
  close = output<void>();

  activeTab = signal<'before' | 'after' | 'changes'>('changes');

  onClose(): void {
    this.close.emit();
  }

  setTab(tab: 'before' | 'after' | 'changes'): void {
    this.activeTab.set(tab);
  }
}
