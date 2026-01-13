import { Component, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import pkg from '../../../../package.json' with { type: 'json' };
const packageInfo = pkg as { version: string };

import { buildDate } from '../../build-info.js';
import { UiService } from '../../core/services/ui.service.js';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  currentYear = signal(new Date().getFullYear());

  appVersion = signal(packageInfo.version);
  buildTimestamp = signal(buildDate);

  private ui = inject(UiService);

  openFeedback() {
    this.ui.openFeedbackDialog();
  }
}
