import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuditFilters } from '../../interfaces/audit-filters.interface';

@Component({
  selector: 'app-audit-filters',
  imports: [FormsModule],
  templateUrl: './audit-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditFiltersComponent {
  filters = input<AuditFilters>({});
  filtersChange = output<AuditFilters>();

  localFilters: AuditFilters = {};

  ngOnInit(): void {
    this.localFilters = { ...this.filters() };
  }

  onApply(): void {
    // Limpiar campos vacíos antes de emitir
    const clean: AuditFilters = {};
    if (this.localFilters.actorUserId?.trim()) clean.actorUserId = this.localFilters.actorUserId.trim();
    if (this.localFilters.entityType?.trim()) clean.entityType = this.localFilters.entityType.trim();
    if (this.localFilters.entityId?.trim()) clean.entityId = this.localFilters.entityId.trim();
    if (this.localFilters.action?.trim()) clean.action = this.localFilters.action.trim();
    if (this.localFilters.from) clean.from = this.localFilters.from;
    if (this.localFilters.to) clean.to = this.localFilters.to;

    this.filtersChange.emit(clean);
  }

  onClear(): void {
    this.localFilters = {};
    this.filtersChange.emit({});
  }
}
