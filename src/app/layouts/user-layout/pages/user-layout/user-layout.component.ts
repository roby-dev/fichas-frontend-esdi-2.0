import { COMMITTEE_ID_KEY } from '@/core/constants/constants';
import { AuthService } from '@/core/services/auth.service';
import { WebsocketService } from '@/core/services/socket.service';
import { ChildrenState } from '@/features/children/states/children.state';
import { CommitteesService } from '@/features/committees/services/committees.service';
import { AdminCommitteeState } from '@/features/committees/states/admin-committee.state';
import { CommitteeState } from '@/features/committees/states/committee.state';
import { CommunityHallState } from '@/features/community-halls/states/community-hall.state.ts';
import { UserState } from '@/features/users/states/user.state';
import { HeaderItem } from '@/layouts/shared/interfaces/header-item.interface';
import { MenuItem } from '@/layouts/shared/interfaces/menu-item.interface';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { switchMap, finalize, Observable, forkJoin, EMPTY, catchError, throwError } from 'rxjs';
import { LoadingComponent } from "@/features/shared/components/loading/loading.component";
import { SidebarComponent } from "@/layouts/shared/sidebar/sidebar.component";
import { HeaderComponent } from "@/layouts/shared/header/header.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-layout',
  imports: [LoadingComponent, SidebarComponent, HeaderComponent, RouterModule, CommonModule],
  templateUrl: './user-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserLayoutComponent {
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

  menuItems = signal<MenuItem[]>([
    {
      title: 'Resumen',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      route: 'dashboard',
    },
    {
      title: 'Niños',
      icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
      route: 'children',
    },
    // {
    //   title: 'Users',
    //   icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    //   route: '/users'
    // },
    // {
    //   title: 'Settings',
    //   icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    //   children: [
    //     {
    //       title: 'Profile',
    //       icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    //       route: '/settings/profile'
    //     },
    //     {
    //       title: 'Security',
    //       icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    //       route: '/settings/security'
    //     },
    //     {
    //       title: 'Preferences',
    //       icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
    //       route: '/settings/preferences'
    //     }
    //   ],
    //   expanded: false
    // }
  ]);

  headerItems = signal<HeaderItem[]>([
    {
      title: 'Configurar Comité',
      route: '/admin/committee',
    },
    {
      title: 'Configurar Locales',
      route: '/admin/community-halls',
    },
  ]);

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
