import {ChangeDetectorRef, Component} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {openSettings} from "./settings/settings.component";
import {UpdateService} from "../update.service";
import {nonnull} from "../util";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  route?: string;

  isInstalled?: boolean;
  updateAvailable?: boolean;

  constructor(router: Router, private updateService: UpdateService, changeDetector: ChangeDetectorRef) {
    nonnull(updateService.isInstalled$).subscribe(it => {
      this.isInstalled = it;
      changeDetector.detectChanges();
    });
    nonnull(updateService.updateAvailable$).subscribe(it => {
      this.updateAvailable = it;
      changeDetector.detectChanges();
    });

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.route = event.url;
      }
    });
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
