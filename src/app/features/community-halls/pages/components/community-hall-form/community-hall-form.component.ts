import { ChangeDetectionStrategy, Component, input, OnInit, output, signal } from '@angular/core';
import { form, required, FormField } from '@angular/forms/signals';
import { ButtonComponent } from '@/features/shared/components/button/button.component';
import { InputComponent } from '@/features/shared/components/input/input.component';
import { Committee } from '@/features/committees/interfaces/committee.interface';
import { CreateCommunityHallRequest } from '@/features/community-halls/interfaces/create-community-hall-request.interface';

@Component({
  standalone: true,
  selector: 'app-community-hall-form',
  imports: [ButtonComponent, InputComponent, FormField],
  templateUrl: './community-hall-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityHallFormComponent implements OnInit {
  isLoading = input.required<boolean>();
  committees = input.required<Committee[]>();
  communityHall = input<CreateCommunityHallRequest | null>(null);
  saveCommunityHallEvent = output<CreateCommunityHallRequest>();

  communityHallModel = signal<Partial<CreateCommunityHallRequest>>({
    localId: '',
    name: '',
    committeeRef: '',
  });

  form = form(this.communityHallModel, (schemaPath) => {
    required(schemaPath.localId!, { message: 'ID de local requerido' });
    required(schemaPath.name!, { message: 'Nombre requerido' });
    required(schemaPath.committeeRef!, { message: 'Seleccione un comité' });
  });

  ngOnInit(): void {
    const c = this.communityHall();
    if (c) {
      this.communityHallModel.set({
        localId: c.localId ?? '',
        name: c.name ?? '',
        committeeRef: c.committeeRef ?? '',
      });
    }
  }

  get localIdControl() { return this.form.localId!; }
  get nameControl() { return this.form.name!; }
  get committeeRefControl() { return this.form.committeeRef!; }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.form().invalid()) return;

    const value = this.communityHallModel();

    const request: CreateCommunityHallRequest = {
      localId: value.localId ?? '',
      name: value.name ?? '',
      committeeRef: value.committeeRef ?? '',
    };

    this.saveCommunityHallEvent.emit(request);
  }
}
