import { ChildrenState } from '@/features/children/states/children.state';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
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

  readonly childrenState = inject(ChildrenState);

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

  goTo(route: string) {
    this.router.navigate([route]);
  }
}
