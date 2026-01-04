import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

// App imports
import pkg from '../../../../package.json';
import { buildDate } from '../../build-info';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  currentYear = signal(new Date().getFullYear());
  appVersion = signal(pkg.version);
  buildTimestamp = signal(buildDate);
}
