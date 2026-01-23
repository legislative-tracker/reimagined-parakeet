export type RuntimeConfig = {
  organization: {
    name: string;
    url: string;
  };
  branding: {
    primaryColor: string;
    logoUrl: string;
    faviconUrl: string;
    darkMode: boolean;
  };
  resources: ResourceLink[];
};

export type ResourceLink = {
  title: string;
  description: string;
  url: string;
  icon: string;
  actionLabel: string;
};

export const GITHUB_RESOURCE: ResourceLink = {
  title: 'GitHub Repository',
  description: 'Access the source code under GNU AGPL v3.0.',
  url: 'https://github.com/legislative-tracker/reimagined-parakeet/',
  icon: 'code',
  actionLabel: 'View Code',
};

export const DEFAULT_CONFIG: RuntimeConfig = {
  organization: {
    name: 'Legislative Tracker',
    url: 'https://legislative-tracker-41022.web.app/',
  },
  branding: {
    logoUrl: 'default_logo.png',
    primaryColor: '#673ab7',
    faviconUrl: 'favicon.ico',
    darkMode: false,
  },
  resources: [GITHUB_RESOURCE],
};
