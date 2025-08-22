import { CommunityHallState } from '@/features/community-halls/states/community-hall.state.ts';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '@/layouts/admin-layout/shared/header/header.component';
import { SidebarComponent } from '@/layouts/admin-layout/shared/sidebar/sidebar.component';
import { CommitteeService } from '../../services/committee.service';
import { CommitteeState } from '../../states/committee.state';
import { COMMITTEE_ID_KEY, COMMITTEE_NAME_KEY } from '@/core/constants/constants';
import { forkJoin, switchMap, tap } from 'rxjs';
import { ChildrenState } from '@/features/children/states/children.state';

@Component({
  standalone: true,
  selector: 'admin-layout',
  imports: [SidebarComponent, HeaderComponent, CommonModule, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AdminLayoutComponent implements OnInit {
  isLoading = signal<boolean>(true);
  isSidebarCollapsed = signal<boolean>(false); // escritorio
  isMobileSidebarOpen = signal<boolean>(false); // móvil (drawer)

  private readonly commmitteeService = inject(CommitteeService);
  private readonly router = inject(Router);

  readonly committeeState = inject(CommitteeState);
  private readonly communityHallState = inject(CommunityHallState);
  private readonly childrenState = inject(ChildrenState);

  toggleSidebar(): void {
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

    if (isMobile) {
      this.isMobileSidebarOpen.update((v) => !v);
    } else {
      this.isSidebarCollapsed.update((v) => !v);
    }
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen.set(false);
  }

  ngOnInit(): void {
    const committeeId = localStorage.getItem(COMMITTEE_ID_KEY);
    const committeeName = localStorage.getItem(COMMITTEE_NAME_KEY);

    if (!committeeId && !committeeName) {
      this.router.navigate(['/admin/committee']);
      this.isLoading.set(false);
      return;
    }

    this.commmitteeService
      .getCommitteeById(committeeId!)
      .pipe(
        tap((res) => this.committeeState.setCommittee(res)),
        switchMap(() => forkJoin([this.communityHallState.loadCommunityHalls(), this.childrenState.loadChildren()]))
      )
      .subscribe({
        next: () => this.isLoading.set(false),
        error: () => {
          this.router.navigate(['/admin/committee']);
          this.isLoading.set(false);
        },
      });
  }
}
