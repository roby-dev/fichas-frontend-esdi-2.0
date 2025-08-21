import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'empty-layout',
  imports: [],
  templateUrl: './empty-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EmptyLayoutComponent { }
