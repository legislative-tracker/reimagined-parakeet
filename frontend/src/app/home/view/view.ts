import { Component, input } from '@angular/core';

@Component({
  selector: 'app-view',
  imports: [],
  templateUrl: './view.html',
  styleUrl: './view.scss',
})
export class View {
  state = input.required<string>();
}
