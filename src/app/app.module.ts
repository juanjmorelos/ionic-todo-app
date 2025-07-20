import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HomePage } from './presentation/pages/home/home.page';
import { IonicStorageModule } from '@ionic/storage-angular';
import { FirebaseX } from '@awesome-cordova-plugins/firebase-x/ngx';
import { AddTaskPage } from './presentation/pages/addTask/addTask.page';
import { ManageCategoryPage } from './presentation/pages/manageCategory/manageCategory.page';
import { GridViewComponent } from './presentation/pages/home/components/gridView/gridView.component';
import { EmptyComponent } from './presentation/pages/home/components/empty/empty.component';
import { ListViewComponent } from './presentation/pages/home/components/listView/listView.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    AddTaskPage,
    ManageCategoryPage,
    GridViewComponent,
    EmptyComponent,
    ListViewComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    CommonModule,
    FormsModule,
    IonicStorageModule.forRoot(),
    IonicModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FirebaseX,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
