import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { QuillModule } from 'ngx-quill';

import {
  IonicModule,
  IonicRouteStrategy,
  ModalController,
} from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpInterceptorModule } from '../app/connection/middleware/interceptor.module';
import { HttpClientModule } from '@angular/common/http';

import { AdminComponentsModule } from './admin/components/components.module';
import { ClientComponentsModule } from './client/components/components.module';
import { MobileComponentsModule } from './mobile/components/components.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AdminComponentsModule,
    ClientComponentsModule,
    HttpClientModule,
    HttpInterceptorModule,
    MobileComponentsModule,
    QuillModule.forRoot(),
  ],
  providers: [
    ModalController,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
  exports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class AppModule {}
