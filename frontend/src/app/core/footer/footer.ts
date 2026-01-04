import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import pkg from '../../../../package.json';

@Component({
  selector: 'app-footer',
  imports: [DatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  currentYear = signal(new Date().getFullYear());
  appVersion = signal(pkg.version);
}
