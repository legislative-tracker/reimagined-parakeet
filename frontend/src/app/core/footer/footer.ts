import { Component, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

// App imports
import pkg from '../../../../package.json';
import { buildDate } from '../../build-info';
import { UiService } from '../ui-service';

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

  private ui = inject(UiService);

  openFeedback() {
    this.ui.openFeedbackDialog();
  }
}
