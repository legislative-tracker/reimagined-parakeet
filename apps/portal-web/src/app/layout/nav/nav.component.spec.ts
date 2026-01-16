import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router, provideRouter } from '@angular/router';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BehaviorSubject } from 'rxjs';

// Target Component
import { NavComponent } from './nav.component';
import { Footer } from '../footer/footer';

// Service Dependencies
import { AuthService } from '../../core/services/auth.service';
import { ConfigService } from '../../core/services/config.service';

/**
 * @description A lightweight mock component to replace the real Footer during testing.
 * This isolates the NavComponent from the Footer's internal dependencies.
 */
@Component({
  selector: 'app-footer',
  template: '',
  standalone: true,
})
class MockFooter {}

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let router: Router;

  // Mock Services using Vitest spy functions
  const mockAuthService = {
    logout: vi.fn().mockResolvedValue(undefined),
    isLoggedIn: vi.fn().mockReturnValue(true),
    isAdmin: vi.fn().mockReturnValue(true),
    isAnnon: vi.fn().mockReturnValue(false),
    currentUser: signal({ displayName: 'Test User' }),
  };

  const mockConfigService = {
    config: signal({
      branding: {
        logoUrl: '/assets/logo.png',
        primaryColor: '#003366',
        faviconUrl: '/assets/favicon.ico',
      },
    }),
  };

  /** BehaviorSubject to simulate real-time breakpoint changes in tests */
  const screenState$ = new BehaviorSubject<BreakpointState>({ matches: false, breakpoints: {} });
  const mockBreakpointObserver = {
    observe: vi.fn().mockReturnValue(screenState$.asObservable()),
  };

  beforeEach(async () => {
    screenState$.next({ matches: false, breakpoints: {} });

    await TestBed.configureTestingModule({
      imports: [NavComponent],
      providers: [
        provideNoopAnimations(),
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
      ],
    })
      // Component Override to swap the real Footer for our MockFooter
      .overrideComponent(NavComponent, {
        remove: { imports: [Footer] },
        add: { imports: [MockFooter] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Responsive Behavior', () => {
    it('should identify Handset mode correctly', () => {
      screenState$.next({ matches: true, breakpoints: {} });

      let result: boolean | undefined;
      component.isHandset$.subscribe((val) => (result = val));

      expect(result).toBe(true);
    });

    it('should identify Desktop mode correctly', () => {
      screenState$.next({ matches: false, breakpoints: {} });

      let result: boolean | undefined;
      component.isHandset$.subscribe((val) => (result = val));

      expect(result).toBe(false);
    });
  });

  describe('Authentication', () => {
    it('should log out and navigate to login on handleLogout', async () => {
      await component.handleLogout();

      expect(mockAuthService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('Configuration', () => {
    it('should load branding from ConfigService', () => {
      /**
       * Cast to NavComponent safely to access public members.
       * If 'config' is private, we use the bracket notation to bypass access restrictions
       * without losing the benefits of the linter's 'any' check.
       */
      const logoUrl = (
        component as unknown as { config: () => { branding: { logoUrl: string } } }
      ).config().branding.logoUrl;
      expect(logoUrl).toBe('/assets/logo.png');
    });
  });
});
