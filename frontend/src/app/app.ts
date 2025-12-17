import { Component, signal } from '@angular/core';
import { NavComponent } from './nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [NavComponent],
  templateUrl: './app.html',
  styleUrl: './app.sass'
})
export class App {
  protected readonly title = signal('Legislative Tracker | CWAPolitical.org');
}
