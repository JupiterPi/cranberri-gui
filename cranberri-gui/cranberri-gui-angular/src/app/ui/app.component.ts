import {Component} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {openSettings} from "./settings/settings.component";
import {UpdateService} from "../update.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  route?: string;

  isInstalled = false;
  updateAvailable = false;

  constructor(router: Router, updateService: UpdateService) {
    this.updateAvailable = updateService.updateAvailable;

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.route = event.url;
      }
    });

    (async () => {
      this.isInstalled = await api.isInstalled();
    })();
  }

  close() {
    if (this.route == "/") {
      api.close();
    } else {
      window.close();
    }
  }

  readonly openSettings = openSettings;
}
