import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'unauthorized',
  imports: [],
  templateUrl: './unauthorized.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UnauthorizedComponent { }
