import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

interface ResourceLink {
  title: string;
  description: string;
  url: string;
  icon: string;
  actionLabel: string;
}

@Component({
  selector: 'app-about',
  standalone: true,

  imports: [MatCardModule, MatButtonModule, MatListModule, MatIconModule],
  templateUrl: './about.html',
  styleUrls: ['../pages.scss', './about.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  readonly resources = signal<ResourceLink[]>([
    {
      title: 'GitHub Repository',
      description: 'Access the source code under GNU AGPL v3.0.',
      url: 'https://github.com/legislative-tracker/reimagined-parakeet/',
      icon: 'code',
      actionLabel: 'View Code',
    },
    {
      title: 'CWA Political',
      description: "Learn more about the CWA's political work.",
      url: 'https://cwapolitical.org',
      icon: 'public',
      actionLabel: 'Visit Site',
    },
  ]);

  readonly details = signal([
    {
      title: 'Data Sources',
      icon: 'dns',
      content:
        "We aggregate data via OpenStates & the NY Legislature's APIs, syncing nightly to capture the latest bill sponsorships and legislator movements.",
    },
    {
      title: 'Open Source',
      icon: 'terminal',
      content:
        'Built with Angular v20 and Firebase. We welcome community contributions to help improve transparency in advocacy.',
    },
    {
      title: 'Disclaimer',
      icon: 'warning',
      content:
        'This tool is for informational purposes only and is not an official government service. Always verify with official legislative records.',
    },
  ]);
}
