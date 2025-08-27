import { AdminCommittee } from '@/features/committees/interfaces/admin-committee.interface';
import { AssignCommitteeRequest } from '@/features/committees/interfaces/assign-committee-request.interface';
import { CreateCommitteeRequest } from '@/features/committees/interfaces/create-committee-request.interface';
import { ButtonComponent } from '@/features/shared/components/button/button.component';
import { User } from '@/features/users/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-assign-committee-form',
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './assign-committee-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignCommitteeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  isLoading = input.required<boolean>();
  saveAssignCommitteeEvent = output<AssignCommitteeRequest>();
  form!: FormGroup;
  users = input.required<User[]>();
  committees = input.required<AdminCommittee[]>();

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      committeeId: ['', [Validators.required]],
      userId: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const value = this.form.value as Partial<AssignCommitteeRequest>;
    const committee = this.committees().find(x=> x.id == value.committeeId);
    const request: AssignCommitteeRequest = {
      committeeId: committee?.committeeId ?? '',
      name: committee?.name ?? '',
      userId: value.userId ?? '',
    };

    this.saveAssignCommitteeEvent.emit(request);
  }
}
