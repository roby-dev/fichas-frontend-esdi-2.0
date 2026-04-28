import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../services/session.service';
import { Session } from '../../interfaces/session.interface';
import { SessionUserSummary } from '../../interfaces/session-user-summary.interface';

@Component({
  selector: 'app-sessions',
  imports: [CommonModule, FormsModule],
  templateUrl: './sessions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SessionsComponent implements OnInit {
  private readonly sessionService = inject(SessionService);

  // Summary
  summaries = signal<SessionUserSummary[]>([]);
  summaryTotal = signal(0);
  summaryLimit = signal(50);
  summaryOffset = signal(0);
  isSummaryLoading = signal(false);

  // Historial de sesiones
  sessions = signal<Session[]>([]);
  total = signal(0);
  limit = signal(50);
  offset = signal(0);
  isLoading = signal(false);

  // Filtros (historial)
  filterUserId = signal<string>('');
  filterActive = signal<boolean | undefined>(undefined);
  showFilters = signal(false);

  ngOnInit(): void {
    this.loadSummary();
    this.loadSessions();
  }

  // ── Summary ──────────────────────────────────────

  loadSummary(): void {
    this.isSummaryLoading.set(true);

    this.sessionService
      .getSessionsSummary({
        limit: this.summaryLimit(),
        offset: this.summaryOffset(),
      })
      .subscribe({
        next: (response) => {
          this.summaries.set(response.items);
          this.summaryTotal.set(response.total);
          this.isSummaryLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading sessions summary:', err);
          this.isSummaryLoading.set(false);
        },
      });
  }

  get summaryCurrentPage(): number {
    return Math.floor(this.summaryOffset() / this.summaryLimit()) + 1;
  }

  get summaryTotalPages(): number {
    return Math.ceil(this.summaryTotal() / this.summaryLimit());
  }

  summaryGoToPage(page: number): void {
    if (page < 1 || page > this.summaryTotalPages) return;
    this.summaryOffset.set((page - 1) * this.summaryLimit());
    this.loadSummary();
  }

  summaryNextPage(): void {
    this.summaryGoToPage(this.summaryCurrentPage + 1);
  }

  summaryPrevPage(): void {
    this.summaryGoToPage(this.summaryCurrentPage - 1);
  }

  // ── Historial de sesiones ────────────────────────

  loadSessions(): void {
    this.isLoading.set(true);

    const activeFilter = this.filterActive();

    this.sessionService
      .getSessions({
        userId: this.filterUserId() || undefined,
        active: activeFilter === undefined ? undefined : activeFilter,
        limit: this.limit(),
        offset: this.offset(),
      })
      .subscribe({
        next: (response) => {
          this.sessions.set(response.items);
          this.total.set(response.total);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading sessions:', err);
          this.isLoading.set(false);
        },
      });
  }

  onFilterChange(): void {
    this.offset.set(0);
    this.loadSessions();
  }

  clearFilters(): void {
    this.filterUserId.set('');
    this.filterActive.set(undefined);
    this.onFilterChange();
  }

  toggleFilters(): void {
    this.showFilters.update((v) => !v);
  }

  get currentPage(): number {
    return Math.floor(this.offset() / this.limit()) + 1;
  }

  get totalPages(): number {
    return Math.ceil(this.total() / this.limit());
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.offset.set((page - 1) * this.limit());
    this.loadSessions();
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }
}
