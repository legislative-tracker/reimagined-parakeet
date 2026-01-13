import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { catchError, throwError } from "rxjs";

/**
 * Functional Interceptor with Lazy-Loaded UI dependencies via provideAnimationsAsync.
 * @description Centralizes error notifications for Zoneless Angular v20 applications.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // Capture the snackbar service synchronously at the top level
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: unknown) => {
      let errorMessage = "An unexpected error occurred";

      if (error instanceof HttpErrorResponse) {
        errorMessage = error.error?.message || error.statusText || "Server Error";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Display the error notification
      snackBar.open(errorMessage, "Close", {
        duration: 5000,
        panelClass: ["error-snackbar"],
        horizontalPosition: "end",
        verticalPosition: "bottom",
      });

      // Propagate the error for further handling if necessary
      return throwError(() => error);
    })
  );
};
