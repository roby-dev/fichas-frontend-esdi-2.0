import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommitteesService } from '../../services/committees.service';
import { CommitteeState } from '../../../../layouts/admin-layout/states/committee.state';
import { Committee } from '@/layouts/admin-layout/interfaces/committee.interface';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-committee',
  imports: [CommonModule],
  templateUrl: './committee.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CommitteeComponent implements OnInit {
  private readonly committeeService = inject(CommitteesService);
  private readonly router = inject(Router);

  readonly committeeState = inject(CommitteeState);

  committees = signal<Committee[]>([]);

  ngOnInit(): void {
    this.loadCommittee();
  }

  loadCommittee() {
    this.committeeService
      .getCommittees()
      .pipe(
        tap({
          next: (res) => {
            this.committees.set(res);
            console.log(res);
          },
          error: (err) => {
            console.error(err);
          },
        })
      )
      .subscribe();
  }

  selectCommittee(committee: Committee) {
    this.committeeState.setCommittee(committee);
    this.router.navigate(['/admin/dashboard']);
  }
}
