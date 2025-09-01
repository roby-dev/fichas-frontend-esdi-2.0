import { UserState } from '@/features/users/states/user.state';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { MenuItem } from '../interfaces/menu-item.interface';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  isCollapsed = input<boolean>(false);
  userState = inject(UserState);
  userName = computed(() => this.userState.user()?.email.split('@')[0] ?? '');
  toggleSidebarEvent = output<void>();

  menuItems = input.required<MenuItem[]>();

  toggleSubmenu(item: MenuItem): void {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }

  closeSidebar() {
    this.toggleSidebarEvent.emit();
  }
}
