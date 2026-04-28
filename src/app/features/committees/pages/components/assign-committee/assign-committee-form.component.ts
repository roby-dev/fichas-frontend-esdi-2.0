import { AdminCommittee } from '@/features/committees/interfaces/admin-committee.interface';
import { AssignCommitteeRequest } from '@/features/committees/interfaces/assign-committee-request.interface';
import { ButtonComponent } from '@/features/shared/components/button/button.component';
import { User } from '@/features/users/interfaces/user.interface';

import { ChangeDetectionStrategy, Component, input, OnInit, output, signal } from '@angular/core';
import { form, required, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-assign-committee-form',
  imports: [ButtonComponent, FormField],
  templateUrl: './assign-committee-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignCommitteeFormComponent implements OnInit {
  isLoading = input.required<boolean>();
  saveAssignCommitteeEvent = output<AssignCommitteeRequest>();
  users = input.required<User[]>();
  committees = input.required<AdminCommittee[]>();

  assignModel = signal({
    committeeId: '',
    userId: '',
  });

  form = form(this.assignModel, (schemaPath) => {
    required(schemaPath.committeeId, { message: 'Seleccione un comité' });
    required(schemaPath.userId, { message: 'Seleccione un usuario' });
  });

  ngOnInit(): void {}

  get committeeIdControl() { return this.form.committeeId!; }
  get userIdControl() { return this.form.userId!; }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.form().invalid()) return;

    const value = this.assignModel();
    const committee = this.committees().find(x=> x.id == value.committeeId);
    const request: AssignCommitteeRequest = {
      committeeId: committee?.committeeId ?? '',
      name: committee?.name ?? '',
      userId: value.userId ?? '',
    };

    this.saveAssignCommitteeEvent.emit(request);
  }
}



