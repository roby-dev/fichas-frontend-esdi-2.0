import { CommunityHallState } from '@/features/community-halls/states/community-hall.state.ts';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '@/layouts/admin-layout/shared/header/header.component';
import { SidebarComponent } from '@/layouts/admin-layout/shared/sidebar/sidebar.component';
import { CommitteeState } from '../../../../features/committees/states/committee.state';
import { COMMITTEE_ID_KEY, COMMITTEE_NAME_KEY } from '@/core/constants/constants';
import { catchError, EMPTY, finalize, forkJoin, Observable, switchMap, tap, throwError } from 'rxjs';
import { ChildrenState } from '@/features/children/states/children.state';
import { CommitteesService } from '@/features/committees/services/committees.service';
import { LoadingComponent } from '@/features/shared/components/loading/loading.component';
import { AuthService } from '@/core/services/auth.service';
import { UserState } from '@/features/users/states/user.state';
import { WebsocketService } from '@/core/services/socket.service';
import { AdminCommitteeState } from '@/features/committees/states/admin-committee.state';

@Component({
  standalone: true,
  selector: 'admin-layout',
  imports: [SidebarComponent, HeaderComponent, CommonModule, RouterOutlet, LoadingComponent],
  templateUrl: './admin-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AdminLayoutComponent implements OnInit, OnDestroy {
  isLoading = signal<boolean>(true);
  isSidebarCollapsed = signal<boolean>(false); // escritorio
  isMobileSidebarOpen = signal<boolean>(false); // móvil (drawer)

  private readonly authService = inject(AuthService);
  private readonly commmitteeService = inject(CommitteesService);
  private readonly router = inject(Router);
  private readonly communityHallState = inject(CommunityHallState);
  private readonly childrenState = inject(ChildrenState);
  private readonly webSocketService = inject(WebsocketService);

  readonly committeeState = inject(CommitteeState);
  readonly userState = inject(UserState);
  readonly adminCommitteeState = inject(AdminCommitteeState);

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
    this.isLoading.set(true);
    this.loadUser();
    this.connectWebSocket();

    this.loadInitialData()
      .pipe(
        switchMap(() => this.loadCommitteeDetailsFromStorage()),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: () => {
          console.log('Toda la data inicial se cargó correctamente. ✅');
          this.listenSocket();
        },
        error: (err) => {
          console.error('Ocurrió un error durante la carga inicial:', err);
          this.router.navigate(['/admin/committee']);
        },
      });
  }

  private loadInitialData(): Observable<any> {
    if (this.authService.isAdmin()) {
      return forkJoin([
        this.committeeState.loadAllCommittes(),
        this.adminCommitteeState.loadCommitteees(),
        this.userState.loadUsers(),
      ]);
    } else {
      return this.committeeState.loadCommittesByUser();
    }
  }

  private loadCommitteeDetailsFromStorage(): Observable<any> {
    const committeeId = localStorage.getItem(COMMITTEE_ID_KEY);

    if (!committeeId) {
      this.router.navigate(['/admin/committee']);
      return EMPTY;
    }

    return this.commmitteeService.getCommitteeById(committeeId).pipe(
      switchMap((committee) => {
        this.committeeState.setCommittee(committee);
        return forkJoin([this.communityHallState.loadCommunityHalls(), this.childrenState.loadChildren()]);
      }),
      catchError((error) => {
        this.router.navigate(['/admin/committee']);
        return throwError(() => new Error('Error al cargar el comité por ID'));
      })
    );
  }

  loadUser() {
    const decoded = this.authService.getDecodedToken();
    this.userState.setUser(decoded!.email, decoded!.roles);
  }

  private connectWebSocket() {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.webSocketService.connect(token);
    }
  }

  ngOnDestroy() {
    this.webSocketService.disconnect();
  }

  listenSocket() {
    this.webSocketService.socket.on('reconnect_attempt', (attempt: number) => {
      console.log('🔄 Intentando reconectar (#', attempt, ')');
    });

    this.webSocketService.socket.on('reconnect_failed', () => {
      console.error('⚠️ No se pudo reconectar');
    });
  }
}
