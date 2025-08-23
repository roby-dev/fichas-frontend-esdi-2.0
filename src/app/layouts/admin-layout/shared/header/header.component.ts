import { ACCESS_TOKEN_KEY, COMMITTEE_ID_KEY, COMMITTEE_NAME_KEY, REFRESH_TOKEN_KEY } from '@/core/constants/constants';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommitteeState } from '../../../../features/committees/states/committee.state';
import { UserState } from '@/features/users/states/user.state';
import { CommunityHallState } from '@/features/community-halls/states/community-hall.state.ts';
import { ChildrenState } from '@/features/children/states/children.state';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly committeeState = inject(CommitteeState);
  private readonly communityHallState = inject(CommunityHallState);
  private readonly childrenState = inject(ChildrenState);

  readonly userState = inject(UserState);

  role = computed(() => this.userState.user()?.roles.includes('Admin')
    ? 'Administrador'
    : 'Usuario');

  userName = computed(() => this.userState.user()!.email.split('@')[0]);

  toggleSidebarEvent = output<void>();
  committeeName = input<string>();
  unreadNotifications = 3;

  dropdownOpen = signal(false);

  toggleSidebar(): void {
    this.toggleSidebarEvent.emit();
  }

  toggleDropdown(): void {
    this.dropdownOpen.update((v) => !v);
  }

  closeDropdown(): void {
    this.dropdownOpen.set(false);
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.committeeState.clearCommittee();
    this.userState.clearUser();
    this.childrenState.clearChildren();
    this.communityHallState.clearCommunityHalls();

    this.router.navigate(['/auth']);
  }
}
