import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

// import { UiService } from '../../core/services/ui.service.js';

@Component({
  selector: 'ui-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  currentYear = signal(new Date().getFullYear());
  // private ui = inject(UiService);
  openFeedback() {
    //     this.ui.openFeedbackDialog();
  }
}
