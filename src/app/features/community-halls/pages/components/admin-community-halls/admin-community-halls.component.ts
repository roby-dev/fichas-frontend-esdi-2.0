import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { switchMap } from 'rxjs';
import { ButtonComponent } from '@/features/shared/components/button/button.component';
import { ModalComponent } from '@/features/shared/components/modal/modal.component';
import { CommitteeState } from '@/features/committees/states/committee.state';
import { CommunityHallsService } from '@/features/community-halls/services/community-halls.service';
import { CreateCommunityHallRequest } from '@/features/community-halls/interfaces/create-community-hall-request.interface';
import { AdminCommunityHallState } from '@/features/community-halls/states/admin-community-hall.state';
import { CommunityHallFormComponent } from '../community-hall-form/community-hall-form.component';

@Component({
  standalone: true,
  selector: 'app-admin-community-halls',
  imports: [CommunityHallFormComponent, ButtonComponent, ModalComponent],
  templateUrl: './admin-community-halls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCommunityHallsComponent {
  private readonly communityHallsService = inject(CommunityHallsService);
  readonly committeeState = inject(CommitteeState);
  readonly adminCommunityHallState = inject(AdminCommunityHallState);

  isCreateModalOpen = signal(false);
  isLoading = signal(false);

  openCreateModal(): void {
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  onCommunityHallSaved(communityHall: CreateCommunityHallRequest): void {
    this.isLoading.set(true);

    this.communityHallsService
      .createCommunityHall(communityHall)
      .pipe(switchMap(() => this.adminCommunityHallState.loadCommunityHalls()))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.closeCreateModal();
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error(err);
        },
      });
  }
}
