import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { AlertSignalsService } from '../../services/alert-signals.service';
import { AlertSignalChild } from '../../interfaces/alert-signal-child.interface';
import { CommitteeState } from '@/features/committees/states/committee.state';
import { ToastService } from '@/features/shared/components/toast/toast.service';
import { COMMITTEE_CODE_KEY } from '@/core/constants/constants';
import { AlertSignalCardComponent } from '../../components/alert-signal-card/alert-signal-card.component';
import { CheckboxGroupComponent, CheckboxOption } from '@/features/shared/components/checkbox-group/checkbox-group.component';

@Component({
  selector: 'app-alert-signals',
  standalone: true,
  imports: [AlertSignalCardComponent, CheckboxGroupComponent],
  templateUrl: './alert-signals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AlertSignalsComponent {
  private readonly alertSignalsService = inject(AlertSignalsService);
  private readonly committeeState = inject(CommitteeState);
  private readonly toastService = inject(ToastService);

  children = signal<AlertSignalChild[]>([]);
  isLoading = signal(false);
  showUpload = signal(false);

  selectedFile = signal<File | null>(null);
  uploadProgress = signal<number | null>(null);
  isUploading = signal(false);

  search = signal('');
  onlyActive = signal(false);
  selectedLocals = signal<string[]>([]);

  localOptions = computed<CheckboxOption[]>(() =>
    [...new Set(this.children().map((c) => c.communityHallName))]
      .sort()
      .map((name) => ({ value: name, label: name }))
  );

  filteredChildren = computed(() => {
    const q = this.search().toLowerCase().trim();
    const locals = this.selectedLocals();
    const active = this.onlyActive();

    return this.children().filter((c) => {
      if (active && !c.activeAlertSignal?.trim()) return false;
      if (locals.length > 0 && !locals.includes(c.communityHallName)) return false;
      if (q) {
        return (
          c.fullName.toLowerCase().includes(q) ||
          c.documentNumber.includes(q)
        );
      }
      return true;
    });
  });

  ngOnInit(): void {
    this.load();
  }

  private getCommitteeCode(): string | null {
    return this.committeeState.committee()?.committeeId
      ?? localStorage.getItem(COMMITTEE_CODE_KEY);
  }

  load(): void {
    const committeeCode = this.getCommitteeCode();
    if (!committeeCode) return;

    this.isLoading.set(true);
    this.alertSignalsService.getAlertSignalsByCommittee(committeeCode).subscribe({
      next: (data) => {
        this.children.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toastService.error('No se pudieron cargar las señales de alerta');
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFile.set(file);
    input.value = '';
  }

  onUpload(): void {
    const file = this.selectedFile();
    const committeeId = this.committeeState.committee()?.committeeId
      ?? localStorage.getItem(COMMITTEE_CODE_KEY);
    if (!file || !committeeId) return;

    this.isUploading.set(true);
    this.uploadProgress.set(0);

    this.alertSignalsService.bulkUpdate({ file, committeeId }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          const pct = event.total ? Math.round((100 * event.loaded) / event.total) : 0;
          this.uploadProgress.set(pct);
        } else if (event.type === HttpEventType.Response) {
          this.isUploading.set(false);
          this.uploadProgress.set(null);
          this.selectedFile.set(null);
          this.showUpload.set(false);
          this.toastService.success('Archivo procesado correctamente');
          this.load();
        }
      },
      error: () => {
        this.isUploading.set(false);
        this.uploadProgress.set(null);
        this.toastService.error('Error al procesar el archivo');
      },
    });
  }

  toggleUpload(): void {
    this.showUpload.update((v) => !v);
    if (!this.showUpload()) {
      this.selectedFile.set(null);
      this.uploadProgress.set(null);
    }
  }

  onSearchChange(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  onLocalsChange(locals: string[]): void {
    this.selectedLocals.set(locals);
  }

  toggleOnlyActive(): void {
    this.onlyActive.update((v) => !v);
  }
}
