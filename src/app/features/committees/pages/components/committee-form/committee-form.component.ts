import { CreateCommitteeRequest } from '@/features/committees/interfaces/create-committee-request.interface';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from "@/features/shared/components/button/button.component";

@Component({
  standalone: true,
  selector: 'app-committee-form',
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './committee-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommitteeFormComponent {
  private readonly fb = inject(FormBuilder);

  isLoading = input.required<boolean>();
  committee = input<CreateCommitteeRequest | null>(null);
  saveComitteeEvent = output<CreateCommitteeRequest>();
  form!: FormGroup;

  ngOnInit(): void {
    this.initForm();

    const c = this.committee();
    if (c) {
      this.form.patchValue({
        committeeId: c.committeeId ?? '',
        name: c.name ?? '',
      });
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      committeeId: ['', [Validators.required]],
      name: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const value = this.form.value as Partial<CreateCommitteeRequest>;

    const request: CreateCommitteeRequest = {
      committeeId: value.committeeId ?? '',
      name: value.name ?? '',
    };

    this.saveComitteeEvent.emit(request);
  }
}
