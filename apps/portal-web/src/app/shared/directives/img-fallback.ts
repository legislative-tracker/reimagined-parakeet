import { Directive, HostListener, ElementRef, Renderer2, inject, input } from '@angular/core';

/**
 * A directive that provides a fallback image mechanism for `<img>` elements.
 * @description When the original image source fails to load, this directive
 * automatically replaces it with a placeholder to prevent broken UI elements.
 */
@Directive({
  selector: 'img[appFallback]',
  standalone: true,
})
export class ImgFallbackDirective {
  /** The default asset path used if no custom fallback is provided. */
  private readonly DEFAULT_IMAGE = '/assets/account_circle_40.svg';

  /** * The fallback image URL.
   * @description Uses Angular Signals (input()) for reactive property binding.
   */
  public readonly appFallback = input<string>(this.DEFAULT_IMAGE);

  /** Reference to the host image element. */
  private readonly el = inject<ElementRef<HTMLImageElement>>(ElementRef);

  /** Renderer service for safe DOM manipulations. */
  private readonly renderer = inject(Renderer2);

  /**
   * Listens for the 'error' event on the host image element.
   * @description Triggered when the browser fails to load the source URL.
   * It swaps the source for the fallback and applies a CSS class for styling.
   */
  @HostListener('error')
  public onError(): void {
    // Access the signal value; fallback to DEFAULT_IMAGE if the signal returns a falsy value.
    const targetFallback = this.appFallback() || this.DEFAULT_IMAGE;
    const img = this.el.nativeElement;

    // Preventive check: If the current src is already the fallback, stop to prevent infinite loops.
    if (img.src.includes(targetFallback)) {
      console.error('🚨 Critical: Fallback image is missing at:', targetFallback);
      return;
    }

    // Log the event for debugging in development environments.
    console.log(`Original image failed. Switching to: ${targetFallback}`);

    // Remove srcset to ensure the browser doesn't try to load other responsive variants of the failed image.
    this.renderer.removeAttribute(img, 'srcset');

    // Apply the fallback image and a utility class for optional placeholder styling.
    this.renderer.setAttribute(img, 'src', targetFallback);
    this.renderer.addClass(img, 'is-placeholder');
  }
}
