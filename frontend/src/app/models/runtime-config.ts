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
};

export const DEFAULT_CONFIG: RuntimeConfig = {
  organization: {
    name: '',
    url: '',
  },
  branding: {
    logoUrl: 'assets/default-logo.png',
    primaryColor: '#673ab7',
    faviconUrl: 'favicon.ico',
    darkMode: false,
  },
};
