import { TestBed } from "@angular/core/testing";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptors, HttpRequest, HttpClient } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
import { Observable } from "rxjs";

// Ensure this path exactly matches your file name
import { errorInterceptor } from "./error-interceptor.js";

describe("errorInterceptor", () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let snackBarSpy: { open: Mock };

  beforeEach(() => {
    snackBarSpy = { open: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it("should catch HttpErrorResponse and show snackbar", () => {
    const testUrl = "/api/test";

    // Resolved 'implicit any' by explicitly typing err
    httpClient.get(testUrl).subscribe({
      error: (err: unknown) => expect(err).toBeTruthy(),
    });

    const req = httpMock.expectOne(testUrl);

    // Simulate a 500 Server Error
    req.flush("Error details", {
      status: 500,
      statusText: "Internal Server Error",
    });

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      "Internal Server Error",
      "Close",
      expect.objectContaining({ panelClass: ["error-snackbar"] })
    );
  });

  it("should handle generic Error objects", () => {
    const mockReq = new HttpRequest("GET", "/test");

    // Resolved 'Parsing error' and 'Missing Observable' by using standard RxJS import
    const mockNext = vi.fn().mockReturnValue(
      new Observable((subscriber) => {
        subscriber.error(new Error("Firebase specialized error"));
      })
    );

    // Run the interceptor function directly in an injection context
    TestBed.runInInjectionContext(() => {
      errorInterceptor(mockReq, mockNext).subscribe({
        error: (err: Error) => {
          expect(err.message).toBe("Firebase specialized error");
          expect(snackBarSpy.open).toHaveBeenCalledWith(
            "Firebase specialized error",
            "Close",
            expect.anything()
          );
        },
      });
    });
  });
});
