import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { By } from '@angular/platform-browser';
import { About } from './about';

describe('About Component', () => {
  let component: About;
  let fixture: ComponentFixture<About>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [About],
    }).compileComponents();

    fixture = TestBed.createComponent(About);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct number of resource links', () => {
    const listItems = fixture.debugElement.queryAll(By.css('a[mat-list-item]'));
    expect(listItems.length).toBe(component.resources().length);
  });

  it('should enforce security best practices on external links', () => {
    const externalLinks = fixture.debugElement.queryAll(By.css('a[href^="http"]'));

    externalLinks.forEach((debugEl) => {
      const anchor = debugEl.nativeElement as HTMLAnchorElement;
      const rel = anchor.getAttribute('rel');
      const target = anchor.getAttribute('target');

      if (target === '_blank') {
        expect(rel).toContain('noopener');
        expect(rel).toContain('noreferrer');
      }
    });
  });
});
