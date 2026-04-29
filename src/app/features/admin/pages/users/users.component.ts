import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { switchMap, of } from 'rxjs';
import { UserState } from '@/features/users/states/user.state';
import { UsersService } from '@/features/users/services/users.service';
import { ToastService } from '@/features/shared/components/toast/toast.service';
import { ModalComponent } from '@/features/shared/components/modal/modal.component';
import { UserFormComponent, UserFormValue } from '../../components/user-form/user-form.component';
import { AdminCommitteesService } from '@/features/committees/services/admin-committees.service';
import { AdminCommitteeState } from '@/features/committees/states/admin-committee.state';
import { CommitteeState } from '@/features/committees/states/committee.state';
import { AssignCommitteeFormComponent } from '@/features/committees/pages/components/assign-committee/assign-committee-form.component';
import { AssignCommitteeRequest } from '@/features/committees/interfaces/assign-committee-request.interface';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ModalComponent, UserFormComponent, AssignCommitteeFormComponent],
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersComponent {
  private readonly userState = inject(UserState);
  private readonly usersService = inject(UsersService);
  private readonly toastService = inject(ToastService);
  private readonly adminCommitteesService = inject(AdminCommitteesService);

  readonly adminCommitteeState = inject(AdminCommitteeState);
  readonly committeeState = inject(CommitteeState);

  users = this.userState.users;

  showCreateModal = signal(false);
  showAssignModal = signal(false);
  isCreating = signal(false);
  isAssigning = signal(false);

  openCreateModal(): void { this.showCreateModal.set(true); }
  closeCreateModal(): void { this.showCreateModal.set(false); }

  openAssignModal(): void { this.showAssignModal.set(true); }
  closeAssignModal(): void { this.showAssignModal.set(false); }

  onCreateSubmit(value: UserFormValue): void {
    this.isCreating.set(true);

    this.usersService
      .createUser({ email: value.email, password: value.password })
      .pipe(
        switchMap((created) => {
          if (value.roles.length > 0) {
            return this.usersService.assignRoles(created.id, value.roles);
          }
          return of(null);
        })
      )
      .subscribe({
        next: () => {
          this.isCreating.set(false);
          this.closeCreateModal();
          this.toastService.success('Usuario creado correctamente');
          this.userState.loadUsers().subscribe();
        },
        error: () => {
          this.isCreating.set(false);
          this.toastService.error('No se pudo crear el usuario');
        },
      });
  }

  onAssignSubmit(request: AssignCommitteeRequest): void {
    this.isAssigning.set(true);

    this.adminCommitteesService
      .createCommitteeForUser(request)
      .pipe(switchMap(() => this.committeeState.loadAllCommittes()))
      .subscribe({
        next: () => {
          this.isAssigning.set(false);
          this.closeAssignModal();
          this.toastService.success('Comité asignado correctamente');
        },
        error: () => {
          this.isAssigning.set(false);
          this.toastService.error('No se pudo asignar el comité');
        },
      });
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.showCreateModal()) this.closeCreateModal();
    if (this.showAssignModal()) this.closeAssignModal();
  }
}
