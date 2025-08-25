import { AdminCommittee } from '@/features/committees/interfaces/admin-committee.interface';
import { AdminCommitteeState } from '@/features/committees/states/admin-committee.state';
import { CommitteeState } from '@/features/committees/states/committee.state';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommitteeFormComponent } from '../committee-form/committee-form.component';
import { CreateCommitteeRequest } from '@/features/committees/interfaces/create-committee-request.interface';
import { AdminCommitteesService } from '@/features/committees/services/admin-committees.service';
import { switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-admin-committees',
  imports: [CommonModule, CommitteeFormComponent],
  templateUrl: './admin-committees.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCommitteesComponent {
  private readonly adminComitteesService = inject(AdminCommitteesService);
  readonly committeeState = inject(CommitteeState);
  readonly adminCommitteeState = inject(AdminCommitteeState);

  selectedComittee = signal<AdminCommittee | null>(null);
  isModalOpen = signal(false);
  isLoading = signal(false);

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedComittee.set(null);
  }

  onSelectedCommittee(committee: AdminCommittee) {
    this.selectedComittee.set(committee);
    this.openModal();
  }

  onCommitteeSaved(committee: CreateCommitteeRequest): void {
    this.isLoading.set(true);

    const request$ = this.selectedComittee()
      ? this.adminComitteesService.updateCommittee(this.selectedComittee()!.id, committee)
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
