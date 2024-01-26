import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoutesPageRoutingModule } from './routes-routing.module';
import { MobileComponentsModule } from '../components/components.module';

import { RoutesPage } from './routes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoutesPageRoutingModule,
    MobileComponentsModule
  ],
  declarations: [RoutesPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RoutesPageModule { }
