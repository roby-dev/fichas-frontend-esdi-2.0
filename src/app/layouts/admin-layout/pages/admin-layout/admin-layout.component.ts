import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '@/layouts/admin-layout/shared/header/header.component';
import { SidebarComponent } from '@/layouts/admin-layout/shared/sidebar/sidebar.component';
import { CommitteeService } from '../../services/committee.service';
import { CommitteeState } from '../../states/committee.state';
import { COMMITTEE_ID_KEY, COMMITTEE_NAME_KEY } from '@/core/constants/constants';
import { tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'admin-layout',
  imports: [SidebarComponent, HeaderComponent, CommonModule, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AdminLayoutComponent implements OnInit {
  isLoading = signal<boolean>(true);
  isSidebarCollapsed = signal<boolean>(false);

  private readonly commmitteeService = inject(CommitteeService);
  private readonly router = inject(Router);

  readonly committeeState = inject(CommitteeState);

  toggleSidebar(): void {
    this.isSidebarCollapsed.set(!this.isSidebarCollapsed());
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
        tap({
          next: (res) => {
            this.committeeState.setCommittee(res);
          },
        })
      )
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
        },
        error: (err) => {
          this.router.navigate(['/admin/committee']);
          this.isLoading.set(false);
        },
      });
  }
}
