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
    committeeRef: '',
    userRef: '',
  });

  form = form(this.assignModel, (schemaPath) => {
    required(schemaPath.committeeRef, { message: 'Seleccione un comité' });
    required(schemaPath.userRef, { message: 'Seleccione un usuario' });
  });

  ngOnInit(): void {}

  get committeeRefControl() { return this.form.committeeRef!; }
  get userRefControl() { return this.form.userRef!; }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.form().invalid()) return;

    const value = this.assignModel();
    const request: AssignCommitteeRequest = {
      committeeRef: value.committeeRef ?? '',
      userRef: value.userRef ?? '',
    };

    this.saveAssignCommitteeEvent.emit(request);
  }
}



