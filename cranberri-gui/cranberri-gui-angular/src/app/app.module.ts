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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
