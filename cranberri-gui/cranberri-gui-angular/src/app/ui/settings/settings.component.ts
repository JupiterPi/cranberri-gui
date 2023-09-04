import {Component} from '@angular/core';
import {UpdateInfo} from "../../api";
import {NeedsUpdateInfo, UpdateService} from "../../update.service";
import {get, nonnull} from "../../util";

export function openSettings() {
  api.openWindow("settings", 500, 595, true);
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  isInstalled = true;
  updateInfo?: UpdateInfo;

  currentVersions?: UpdateInfo;
  needsUpdate?: NeedsUpdateInfo;

  installLoading = false;

  constructor(private updateService: UpdateService) {
    nonnull(updateService.isInstalled$).subscribe(isInstalled => this.isInstalled = isInstalled);
    nonnull(updateService.updateInfo$).subscribe(updateInfo => this.updateInfo = updateInfo);

    nonnull(updateService.updateInfo$).subscribe(updateInfo => {
      get(updateService.currentVersions$).subscribe(currentVersions => {
        this.currentVersions = currentVersions;
        this.needsUpdate = updateService.needsUpdate(updateInfo, currentVersions);
      });
    });
  }

  install() {
    this.installLoading = true;
    api.install().then(() => {
      this.installLoading = false;
    });
  }

  updatePlugin() {
    this.installLoading = true;
    api.updatePlugin().then(() => {
      this.installLoading = false;
    });
  }
}
