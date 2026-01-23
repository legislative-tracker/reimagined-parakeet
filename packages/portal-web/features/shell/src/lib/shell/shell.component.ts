import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import {
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import type { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

// App imports
import { AuthService } from '@legislative-tracker/portal-web-data-access-auth';
import { ConfigService } from '@legislative-tracker/portal-web-data-access-config';
import { FooterComponent } from '@legislative-tracker/portal-web-ui';

@Component({
  selector: 'lib-shell',
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    FooterComponent,
  ],
})
export class ShellComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);

  // Load branding config
  protected configService = inject(ConfigService);
  protected config = this.configService.config;

  async handleLogout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );
}
