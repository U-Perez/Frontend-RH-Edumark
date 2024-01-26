import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-event-popover',
    template: `
    <ion-list>
      <ion-item>
        <ion-label>
          <h2>{{ title }}</h2>
          <p>{{ description }}</p>
        </ion-label>
      </ion-item>
    </ion-list>
  `,
    styles: [
        `
      ion-list {
        margin: 0;
      }

      ion-item {
        display: block;
        padding: 12px;
      }
    `,
    ],
})
export class EventPopoverComponent {
    @Input() title: string;
    @Input() description: string;

    constructor() { }
}
