import { AlertSignalChild } from './../../../alert-signals/interfaces/alert-signal-child.interface';
import { pipe, tap } from 'rxjs';
import { AlertSignalsService } from '@/features/alert-signals/services/alert-signals.service';
import { Child } from '@/features/children/interfaces/child.interface';
import { ChildrenService } from '@/features/children/services/children.service';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommitteeState } from '@/layouts/admin-layout/states/committee.state';

@Component({
  standalone: true,
  selector: 'dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent implements OnInit {
  private readonly alertSignalsService = inject(AlertSignalsService);
  private readonly childrenService = inject(ChildrenService);
  private readonly committeeState = inject(CommitteeState);

  children = signal<Child[] | undefined>(undefined);
  alertSignalChildren = signal<AlertSignalChild[] | undefined>(undefined);

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.alertSignalsService
      .getAlertSignals()
      .pipe(
        tap({
          next: (res) => {
            this.alertSignalChildren.set(res);
            console.log(res);
          },
          error: (err) => {
            console.error(err);
          },
        })
      )
      .subscribe();
    this.childrenService
      .getChildren()
      .pipe(
        tap({
          next: (res) => {
            this.children.set(res);
            console.log(res);
          },
          error: (err) => {
            console.error(err);
          },
        })
      )
      .subscribe();
  }
}
