import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { MobileToolbarComponent } from './mobile-toolbar/mobile-toolbar.component';
import { MobileCarouselComponent } from './mobile-carousel/mobile-carousel.component';
import { MobileCardBlogComponent } from './mobile-card-blog/mobile-card-blog.component';
import { MobileBlogContentComponent } from './mobile-blog-content/mobile-blog-content.component';
import { MobileToolbarBackComponent } from './mobile-toolbar-back/mobile-toolbar-back.component';
import { MobileEventsComponent } from './mobile-events/mobile-events.component';
import { EventPopoverComponent } from './mobile-events/mobile-events.popover.component';
import { MobileMeetsComponent } from './mobile-meets/mobile-meets.component';
import { AgregarAsesoriaModalComponent } from './mobile-meets/mobile-meets-modal.component';


@NgModule({
  declarations: [
    MobileMenuComponent,
    MobileToolbarComponent,
    MobileCarouselComponent,
    MobileCardBlogComponent,
    MobileBlogContentComponent,
    MobileToolbarBackComponent,
    MobileEventsComponent,
    EventPopoverComponent,
    MobileMeetsComponent,
    AgregarAsesoriaModalComponent


  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbModule,
    IonicModule,
    ReactiveFormsModule
  ],
  exports: [
    MobileMenuComponent,
    MobileToolbarComponent,
    MobileCarouselComponent,
    MobileCardBlogComponent,
    MobileToolbarBackComponent
  ]
})
export class MobileComponentsModule { }