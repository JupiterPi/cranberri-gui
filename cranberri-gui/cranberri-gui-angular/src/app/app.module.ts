import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './ui/app.component';
import {FormsModule} from "@angular/forms";
import { WorldsComponent } from './ui/worlds/worlds.component';
import { ProjectsComponent } from './ui/projects/projects.component';
import {RouterModule} from "@angular/router";
import { SettingsComponent } from './ui/settings/settings.component';
import { MainComponent } from './ui/main/main.component';
import {HttpClientModule} from "@angular/common/http";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    WorldsComponent,
    ProjectsComponent,
    SettingsComponent,
    MainComponent
  ],
    imports: [
      BrowserModule,
      FormsModule,
      RouterModule.forRoot([
        { path: "", component: MainComponent },
        { path: "settings", component: SettingsComponent },
      ]),
      HttpClientModule,
    ],
  providers: [
    { // as per https://stackoverflow.com/questions/46917738/angular-electron-white-screen-after-reload-page
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
