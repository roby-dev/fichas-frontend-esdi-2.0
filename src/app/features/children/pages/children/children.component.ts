import { Child } from '@/features/children/interfaces/child.interface';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
  provideExperimentalZonelessChangeDetection,
  computed,
} from '@angular/core';
import { ChildCardComponent } from '../../components/child-card/child-card.component';
import { CommunityHallState } from '@/features/community-halls/states/community-hall.state.ts';
import { ChildrenState } from '../../states/children.state';
import { ChildFormComponent } from '../../components/child-form/child-form/child-form.component';
import { CreateUpdateChildRequest } from '../../interfaces/create-update-child-request.interface';
import { ChildrenService } from '../../services/children.service';
import { switchMap } from 'rxjs';

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
  isLoading = signal(false);

  searchTerm = signal<string>('');

  filteredChildren = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.childrenState.children();

    return this.childrenState.children().filter((child) =>
      child.documentNumber.toLowerCase().includes(term) ||
      child.firstName.toLowerCase().includes(term) ||
      child.lastName.toLowerCase().includes(term)
    );
  });

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  openModal(): void {
    this.isModalOpen.set(true);

    // opcional: focus en el modal o primer input. Puedes usar ViewChild en el componente del formulario
    // y exponer un método focusFirst() para llamarlo aquí.
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedChild.set(null);
  }

  onChildSaved(child: CreateUpdateChildRequest): void {
    this.isLoading.set(true);

    const request$ = this.selectedChild()
      ? this.childrenService.updateChild(this.selectedChild()!.id, child)
      : this.childrenService.createChild(child);

    request$
      .pipe(
        switchMap(() => this.childrenState.loadChildren())
      )
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.closeModal();
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error(err)
        },
      });
  }

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
