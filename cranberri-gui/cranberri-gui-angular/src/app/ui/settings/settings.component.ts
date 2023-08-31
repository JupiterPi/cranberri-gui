import {Component} from '@angular/core';
import {UpdateInfo} from "../../api";
import {NeedsUpdateInfo, UpdateService} from "../../update.service";

export function openSettings() {
  api.openWindow("settings", 500, 500, true);
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

  constructor(updateService: UpdateService) {
    (async () => {
      this.isInstalled = await api.isInstalled();
      this.updateInfo = await api.getUpdateInfo();

      updateService.getCurrentVersions().subscribe(currentVersions => {
        this.currentVersions = currentVersions;
        this.needsUpdate = updateService.needsUpdate(this.updateInfo!!, currentVersions);
      });
    })();
  }

  install() {
    this.installLoading = true;
    api.install().then(() => {
      this.installLoading = false;
      api.isInstalled().then(isInstalled => this.isInstalled = isInstalled);
    });
  }
}
