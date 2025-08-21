import { ACCESS_TOKEN_KEY, COMMITTEE_ID_KEY, COMMITTEE_NAME_KEY, REFRESH_TOKEN_KEY } from '@/core/constants/constants';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommitteeState } from '../../states/committee.state';

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

  toggleSidebarEvent = output<void>();
  committeeName = input<string>();
  userName = 'Admin User';
  userRole = 'Administrator';
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
    this.router.navigate(['/auth']);
  }
}
