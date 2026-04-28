import { CreateCommitteeRequest } from '@/features/committees/interfaces/create-committee-request.interface';

import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { ButtonComponent } from "@/features/shared/components/button/button.component";
import { InputComponent } from "@/features/shared/components/input/input.component";
import { form, required } from '@angular/forms/signals';

@Component({
  standalone: true,
  selector: 'app-committee-form',
  imports: [ButtonComponent, InputComponent],
  templateUrl: './committee-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommitteeFormComponent {
  isLoading = input.required<boolean>();
  committee = input<CreateCommitteeRequest | null>(null);
  saveComitteeEvent = output<CreateCommitteeRequest>();
  
  committeeModel = signal<Partial<CreateCommitteeRequest>>({
    committeeId: '',
    name: '',
  });

  form = form(this.committeeModel, (schemaPath) => {
    required(schemaPath.committeeId!, { message: 'ID requerido' });
    required(schemaPath.name!, { message: 'Nombre requerido' });
  });

  ngOnInit(): void {
    const c = this.committee();
    console.log(c);
    if (c) {
      this.committeeModel.set({
        committeeId: c.committeeId ?? '',
        name: c.name ?? '',
      });
    }
  }

  get committeeIdControl() { return this.form.committeeId!; }
  get nameControl() { return this.form.name!; }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.form().invalid()) return;

    const value = this.committeeModel();

    const request: CreateCommitteeRequest = {
      committeeId: value.committeeId ?? '',
      name: value.name ?? '',
    };

    this.saveComitteeEvent.emit(request);
  }
}


