import { AdminCommittee } from '@/features/committees/interfaces/admin-committee.interface';
import { AdminCommitteeState } from '@/features/committees/states/admin-committee.state';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommitteeFormComponent } from '../committee-form/committee-form.component';
import { CreateCommitteeRequest } from '@/features/committees/interfaces/create-committee-request.interface';
import { AdminCommitteesService } from '@/features/committees/services/admin-committees.service';
import { switchMap } from 'rxjs';
import { ButtonComponent } from '@/features/shared/components/button/button.component';
import { ModalComponent } from '@/features/shared/components/modal/modal.component';

@Component({
  standalone: true,
  selector: 'app-admin-committees',
  imports: [CommitteeFormComponent, ButtonComponent, ModalComponent],
  templateUrl: './admin-committees.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCommitteesComponent {
  private readonly adminComitteesService = inject(AdminCommitteesService);
  readonly adminCommitteeState = inject(AdminCommitteeState);

  isModalOpen = signal(false);
  selectedCommittee = signal<AdminCommittee | null>(null);
  isLoading = signal(false);

  openModal(committee: AdminCommittee | null = null): void {
    this.selectedCommittee.set(committee);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedCommittee.set(null);
  }

  onCommitteeSaved(committee: CreateCommitteeRequest): void {
    this.isLoading.set(true);

    const request$ = this.selectedCommittee()
      ? this.adminComitteesService.updateCommittee(this.selectedCommittee()!.id, committee)
      : this.adminComitteesService.createCommittee(committee);

    request$.pipe(switchMap(() => this.adminCommitteeState.loadCommitteees())).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.closeModal();
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error(err);
      },
    });
  }
}
