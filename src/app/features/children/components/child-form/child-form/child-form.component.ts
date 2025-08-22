import { CreateUpdateChildRequest } from '@/features/children/interfaces/create-update-child-request.interface';
import { CommunityHall } from '@/features/community-halls/interfaces/community.interface';
import { toDateInputValue } from '@/features/shared/utilts';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-child-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './child-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  child = input<CreateUpdateChildRequest | null>(null);
  communityHalls = input.required<CommunityHall[]>();

  saveChildEvent = output<CreateUpdateChildRequest>();

  form!: FormGroup;

  ngOnInit(): void {
    this.initForm();

    // si viene un child (modo update), seteamos valores
    const c = this.child();
    if (c) {
      this.form.patchValue({
        documentNumber: c.documentNumber ?? '',
        firstName: c.firstName ?? '',
        lastName: c.lastName ?? '',
        birthday: c.birthday ? toDateInputValue(c.birthday) : null,
        admissionDate: c.admissionDate ? toDateInputValue(c.admissionDate) : null,
        communityHallId: c.communityHallId ?? '',
      });
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      documentNumber: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthday: [null, Validators.required],
      admissionDate: [null, Validators.required],
      communityHallId: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const value = this.form.value as Partial<CreateUpdateChildRequest>;

    const request: CreateUpdateChildRequest = {
      documentNumber: value.documentNumber ?? '',
      firstName: value.firstName ?? '',
      lastName: value.lastName ?? '',
      birthday: value.birthday instanceof Date ? value.birthday : new Date(value.birthday!),
      admissionDate: value.admissionDate instanceof Date ? value.admissionDate : new Date(value.admissionDate!),
      communityHallId: value.communityHallId ?? '',
    };

    this.saveChildEvent.emit(request);
  }
}
