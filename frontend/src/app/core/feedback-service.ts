// frontend/src/app/core/feedback.service.ts
import { inject, Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private functions = inject(Functions);

  async sendFeedback(title: string, body: string) {
    const submitIssue = httpsCallable(this.functions, 'submitAnonymousIssue');
    return await submitIssue({ title, body });
  }
}
