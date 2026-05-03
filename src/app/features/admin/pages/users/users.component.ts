import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  OnInit,
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
import { ResetPasswordFormComponent } from './components/reset-password-form/reset-password-form.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ModalComponent, UserFormComponent, AssignCommitteeFormComponent, ResetPasswordFormComponent],
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersComponent implements OnInit {
  private readonly userState = inject(UserState);
  private readonly usersService = inject(UsersService);
  private readonly toastService = inject(ToastService);
  private readonly adminCommitteesService = inject(AdminCommitteesService);

  readonly adminCommitteeState = inject(AdminCommitteeState);
  readonly committeeState = inject(CommitteeState);

  users = this.userState.users;

  groupedByCommittee = computed(() => {
    const memberships = this.adminCommitteeState.committeeMemberships();
    const map = new Map<string, { committee: { id: string; committeeId: string; name: string }; users: { id: string; email: string }[] }>();
    for (const m of memberships) {
      const key = m.committee.id;
      if (!map.has(key)) {
        map.set(key, { committee: m.committee, users: [] });
      }
      map.get(key)!.users.push({ id: m.user.id, email: m.user.email });
    }
    return [...map.values()];
  });

  showCreateModal = signal(false);
  showAssignModal = signal(false);
  isCreating = signal(false);
  isAssigning = signal(false);

  showResetModal = signal(false);
  isResetting = signal(false);
  selectedUserId = signal<string | null>(null);

  ngOnInit(): void {
    this.adminCommitteeState.loadCommitteeMemberships().subscribe();
  }

  openCreateModal(): void { this.showCreateModal.set(true); }
  closeCreateModal(): void { this.showCreateModal.set(false); }

  openAssignModal(): void { this.showAssignModal.set(true); }
  closeAssignModal(): void { this.showAssignModal.set(false); }

  openResetModal(userId: string | undefined): void {
    if (!userId) return;
    this.selectedUserId.set(userId);
    this.showResetModal.set(true);
  }
  closeResetModal(): void {
    this.selectedUserId.set(null);
    this.showResetModal.set(false);
  }

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
      .pipe(switchMap(() => this.adminCommitteeState.loadCommitteeMemberships()))
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

  onResetSubmit(value: { temporaryPassword: string }): void {
    const userId = this.selectedUserId();
    if (!userId) return;

    this.isResetting.set(true);
    this.usersService.resetPassword(userId, value.temporaryPassword).subscribe({
      next: () => {
        this.isResetting.set(false);
        this.closeResetModal();
        this.toastService.success('Contraseña reseteada. El usuario deberá cambiarla al ingresar.');
      },
      error: () => {
        this.isResetting.set(false);
        this.toastService.error('No se pudo resetear la contraseña');
      }
    });
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.showCreateModal()) this.closeCreateModal();
    if (this.showAssignModal()) this.closeAssignModal();
    if (this.showResetModal()) this.closeResetModal();
  }
}
