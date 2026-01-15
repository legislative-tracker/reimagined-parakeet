import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app.js';
import { getAppConfig } from './app/app.config.js';
import { AppConfig } from './app/core/app-config/app-config-token.js';

// 1. Fetch Config
fetch('/config.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((config: AppConfig) => {
    // 2. Bootstrap with fetched config
    bootstrapApplication(App, getAppConfig(config)).catch((err) => console.error(err));
  })
  .catch((err) => {
    console.error('CRITICAL: Failed to load application configuration.', err);
    document.body.innerHTML = '<h1>Error loading application. Please check console.</h1>';
  });
