import { AssignCommitteeRequest } from '@/features/committees/interfaces/assign-committee-request.interface';
import { CreateCommitteeRequest } from '@/features/committees/interfaces/create-committee-request.interface';
import { ButtonComponent } from '@/features/shared/components/button/button.component';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-assign-committee-form',
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './assign-committee-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignCommitteeFormComponent {
  private readonly fb = inject(FormBuilder);

  isLoading = input.required<boolean>();
  saveAssignCommitteeEvent = output<AssignCommitteeRequest>();
  form!: FormGroup;

  onSubmit(){

  }
}
