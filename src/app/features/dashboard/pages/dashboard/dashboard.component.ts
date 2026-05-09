import { AdminDashboardService } from '@/features/admin/services/admin-dashboard.service';
import { DashboardStatsResponse } from '@/features/admin/interfaces/dashboard-stats.interface';
import { ChangeDetectionStrategy, Component, computed, inject, effect, signal } from '@angular/core';
import { ChildrenState } from '@/features/children/states/children.state';
import { AdminChildrenState } from '@/features/children/states/admin-children.state';
import { CommunityHallState } from '@/features/community-halls/states/community-hall.state';
import { CommitteeState } from '@/features/committees/states/committee.state';
import { AuthService } from '@/core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly adminDashboardService = inject(AdminDashboardService);

  readonly childrenState = inject(ChildrenState);
  readonly adminChildrenState = inject(AdminChildrenState);
  readonly communityHallState = inject(CommunityHallState);
  readonly committeeState = inject(CommitteeState);

  stats = signal<DashboardStatsResponse | null>(null);

  constructor() {
    effect(() => {
      if (this.isAdmin()) {
        this.adminDashboardService.getStats().subscribe(data => this.stats.set(data));
      }
    });
  }

  isAdmin = computed(() => this.authService.isAdmin());

  // ── User dashboard computed ──

  committeeName = computed(() => this.committeeState.committee()?.name ?? '');

  totalChildren = computed(() => this.childrenState.children().length);

  admittedCount = computed(
    () => this.childrenState.children().filter(c => c.isCurrentlyAdmitted).length
  );

  graduatedCount = computed(
    () => this.childrenState.children().filter(c => c.isGraduated).length
  );

  notApplicableCount = computed(() => {
    const children = this.childrenState.children();
    return children.filter(c => !c.isCurrentlyAdmitted && !c.isGraduated).length;
  });

  admittedPercent = computed(() => {
    const total = this.totalChildren();
    if (total === 0) return 0;
    return Math.round((this.admittedCount() / total) * 100);
  });

  graduatedPercent = computed(() => {
    const total = this.totalChildren();
    if (total === 0) return 0;
    return Math.round((this.graduatedCount() / total) * 100);
  });

  notApplicablePercent = computed(() => {
    const total = this.totalChildren();
    if (total === 0) return 0;
    return Math.round((this.notApplicableCount() / total) * 100);
  });

  totalHalls = computed(() => this.communityHallState.communityHalls().length);

  childrenByHall = computed(() => {
    const halls = this.communityHallState.communityHalls();
    const children = this.childrenState.children();

    return halls
      .map(hall => {
        const hallChildren = children.filter(c => c.communityHallId === hall.id);
        return {
          id: hall.id,
          name: hall.name,
          localId: hall.localId,
          total: hallChildren.length,
          admitted: hallChildren.filter(c => c.isCurrentlyAdmitted).length,
          graduated: hallChildren.filter(c => c.isGraduated).length,
        };
      })
      .sort((a, b) => b.total - a.total);
  });

  // ── Admin dashboard computed ──

  totalUsersWithChildren = computed(
    () => this.adminChildrenState.groupedByUser().filter(g => g.children.length > 0).length
  );

  totalChildrenGlobal = computed(() =>
    this.adminChildrenState.groupedByUser().reduce((acc, g) => acc + g.children.length, 0)
  );

  averageChildrenPerUser = computed(() => {
    const users = this.totalUsersWithChildren();
    if (users === 0) return 0;
    return Math.round((this.totalChildrenGlobal() / users) * 10) / 10;
  });

  globalAdmittedPercent = computed(() => {
    const total = this.totalChildrenGlobal();
    if (total === 0) return 0;
    const admitted = this.adminChildrenState
      .groupedByUser()
      .reduce((acc, g) => acc + g.children.filter(c => c.isCurrentlyAdmitted).length, 0);
    return Math.round((admitted / total) * 100);
  });

  globalGraduatedPercent = computed(() => {
    const total = this.totalChildrenGlobal();
    if (total === 0) return 0;
    const graduated = this.adminChildrenState
      .groupedByUser()
      .reduce((acc, g) => acc + g.children.filter(c => c.isGraduated).length, 0);
    return Math.round((graduated / total) * 100);
  });

  usersBreakdown = computed(() =>
    this.adminChildrenState
      .groupedByUser()
      .map(g => {
        const total = g.children.length;
        const admitted = g.children.filter(c => c.isCurrentlyAdmitted).length;
        const graduated = g.children.filter(c => c.isGraduated).length;
        return {
          email: g.user.email,
          total,
          admitted,
          graduated,
          notApplicable: total - admitted - graduated,
        };
      })
      .sort((a, b) => b.total - a.total)
  );

  goTo(route: string) {
    this.router.navigate([route]);
  }
}
