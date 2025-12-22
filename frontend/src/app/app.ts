import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Remove NavComponent from here
  template: '<router-outlet />',
})
export class App {
  protected readonly title = signal('Tracker | CWAPolitical.org');
}
