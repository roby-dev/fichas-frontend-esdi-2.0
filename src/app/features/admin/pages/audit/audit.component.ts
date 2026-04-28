import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuditService } from '../../services/audit.service';
import { AuditEvent } from '../../interfaces/audit-event.interface';
import { AuditFilters } from '../../interfaces/audit-filters.interface';
import { AuditFiltersComponent } from '../../components/audit-filters/audit-filters.component';
import { AuditDetailModalComponent } from '../../components/audit-detail-modal/audit-detail-modal.component';

@Component({
  selector: 'app-audit',
  imports: [DatePipe, AuditFiltersComponent, AuditDetailModalComponent],
  templateUrl: './audit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AuditComponent {
  private readonly auditService = inject(AuditService);

  events = signal<AuditEvent[]>([]);
  total = signal(0);
  limit = signal(50);
  offset = signal(0);
  isLoading = signal(false);
  filters = signal<AuditFilters>({});
  selectedEvent = signal<AuditEvent | null>(null);
  showFilters = signal(false);

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading.set(true);

    this.auditService
      .getAuditEvents({
        ...this.filters(),
        limit: this.limit(),
        offset: this.offset(),
      })
      .subscribe({
        next: (response) => {
          this.events.set(response.items);
          this.total.set(response.total);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading audit events:', err);
          this.isLoading.set(false);
        },
      });
  }

  onFiltersChange(filters: AuditFilters): void {
    this.filters.set(filters);
    this.offset.set(0);
    this.loadEvents();
  }

  onSelectEvent(event: AuditEvent): void {
    this.selectedEvent.set(event);
  }

  closeDetail(): void {
    this.selectedEvent.set(null);
  }

  toggleFilters(): void {
    this.showFilters.update((v) => !v);
  }

  // Paginación
  get currentPage(): number {
    return Math.floor(this.offset() / this.limit()) + 1;
  }

  get totalPages(): number {
    return Math.ceil(this.total() / this.limit());
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.offset.set((page - 1) * this.limit());
    this.loadEvents();
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  @HostListener('window:keydown.escape')
  onEscapePressed(): void {
    if (this.selectedEvent()) {
      this.closeDetail();
    }
  }
}
