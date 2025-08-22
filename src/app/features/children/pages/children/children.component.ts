import { Child } from '@/features/children/interfaces/child.interface';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { ChildCardComponent } from '../../components/child-card/child-card.component';
import { CommunityHallState } from '@/features/community-halls/states/community-hall.state.ts';
import { ChildrenState } from '../../states/children.state';
import { ChildFormComponent } from '../../components/child-form/child-form/child-form.component';
import { CreateUpdateChildRequest } from '../../interfaces/create-update-child-request.interface';
import { ChildrenService } from '../../services/children.service';

@Component({
  selector: 'app-children',
  imports: [ChildCardComponent, ChildFormComponent],
  templateUrl: './children.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChildrenComponent {
  private readonly childrenService = inject(ChildrenService);

  readonly communityHallState = inject(CommunityHallState);
  readonly childrenState = inject(ChildrenState);

  selectedChild = signal<Child | null>(null);
  isModalOpen = signal(false);

  openModal(): void {
    this.isModalOpen.set(true);

    // opcional: focus en el modal o primer input. Puedes usar ViewChild en el componente del formulario
    // y exponer un método focusFirst() para llamarlo aquí.
  }

  // cierra modal
  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedChild.set(null);
  }

  // manejar guardado del form
  onChildSaved(child: CreateUpdateChildRequest): void {
    if (this.selectedChild()) {
      this.childrenService.updateChild(this.selectedChild()!.id, child).subscribe();
    } else {
      this.childrenService.createChild(child).subscribe();
    }
    this.closeModal();
  }

  // cerrar con tecla Esc (a nivel ventana)
  @HostListener('window:keydown.escape', ['$event'])
  onEscapePressed(event: KeyboardEvent) {
    if (this.isModalOpen()) {
      this.closeModal();
    }
  }

  onSelectedChild(child: Child) {
    this.selectedChild.set(child);
    this.openModal();
  }
}
