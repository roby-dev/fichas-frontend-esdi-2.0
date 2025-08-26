import { AdminCommittee } from '@/features/committees/interfaces/admin-committee.interface';
import { AdminCommitteeState } from '@/features/committees/states/admin-committee.state';
import { CommitteeState } from '@/features/committees/states/committee.state';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommitteeFormComponent } from '../committee-form/committee-form.component';
import { CreateCommitteeRequest } from '@/features/committees/interfaces/create-committee-request.interface';
import { AdminCommitteesService } from '@/features/committees/services/admin-committees.service';
import { switchMap } from 'rxjs';
import { ButtonComponent } from '@/features/shared/components/button/button.component';
import { ModalComponent } from '@/features/shared/components/modal/modal.component';
import { AssignCommitteeRequest } from '@/features/committees/interfaces/assign-committee-request.interface';
import { AssignCommitteeFormComponent } from "../assign-committee/assign-committee-form.component";

@Component({
  standalone: true,
  selector: 'app-admin-committees',
  imports: [CommonModule, CommitteeFormComponent, ButtonComponent, ModalComponent, AssignCommitteeFormComponent],
  templateUrl: './admin-committees.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCommitteesComponent {
  private readonly adminComitteesService = inject(AdminCommitteesService);
  readonly committeeState = inject(CommitteeState);
  readonly adminCommitteeState = inject(AdminCommitteeState);

  isCreateUpdateModalOpen = signal(false);
  isAssignModalOpen = signal(false);
  selectedComittee = signal<AdminCommittee | null>(null);
  isLoading = signal(false);

  openCreateUpdateModal(): void {
    this.isCreateUpdateModalOpen.set(true);
  }

  openAssignModal(): void {
    this.isAssignModalOpen.set(true);
  }

  closeCreateUpdateModal(): void {
    this.isCreateUpdateModalOpen.set(false);
    this.selectedComittee.set(null);
  }

  closeAssignModal(): void {
    this.isAssignModalOpen.set(false);
  }

  onSelectedCommittee(committee: AdminCommittee) {
    this.selectedComittee.set(committee);
    this.openCreateUpdateModal();
  }

  onCommitteeSaved(committee: CreateCommitteeRequest): void {
    this.isLoading.set(true);

    const request$ = this.selectedComittee()
      ? this.adminComitteesService.updateCommittee(this.selectedComittee()!.id, committee)
      : this.adminComitteesService.createCommittee(committee);

    request$.pipe(switchMap(() => this.adminCommitteeState.loadCommitteees())).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.closeCreateUpdateModal();
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error(err);
      },
    });
  }

  onAssignSaved(comittee: AssignCommitteeRequest) {
     this.isLoading.set(true);
  }
}
