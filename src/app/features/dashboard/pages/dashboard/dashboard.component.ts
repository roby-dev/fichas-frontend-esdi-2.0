import { ChildrenState } from '@/features/children/states/children.state';
import { AdminChildrenState } from '@/features/children/states/admin-children.state';
import { AuthService } from '@/core/services/auth.service';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly childrenState = inject(ChildrenState);
  readonly adminChildrenState = inject(AdminChildrenState);

  isAdmin = computed(() => this.authService.isAdmin());

  total = computed(() => this.childrenState.children().length);

  admittedPercent = computed(() => {
    const total = this.total();
    if (total === 0) return 0;
    const admitted = this.childrenState.children().filter(c => c.isCurrentlyAdmitted).length;
    return Math.round((admitted / total) * 100);
  });

  graduatedPercent = computed(() => {
    const total = this.total();
    if (total === 0) return 0;
    const graduated = this.childrenState.children().filter(c => c.isGraduated).length;
    return Math.round((graduated / total) * 100);
  });

  notApplicablePercent = computed(() => {
    const total = this.total();
    if (total === 0) return 0;
    const na = this.childrenState.children().filter(
      c => !c.isCurrentlyAdmitted && !c.isGraduated
    ).length;
    return Math.round((na / total) * 100);
  });

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
