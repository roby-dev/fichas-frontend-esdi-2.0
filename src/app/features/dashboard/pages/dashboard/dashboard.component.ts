import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';

@Component({
  standalone: true,
  selector: 'dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent {}
