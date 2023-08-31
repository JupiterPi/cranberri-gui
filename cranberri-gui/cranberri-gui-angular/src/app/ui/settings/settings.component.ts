import {Component} from '@angular/core';
import {UpdateInfo} from "../../api";
import {UpdateService} from "../../update.service";

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
  updateCranberriGui = false;
  updatePaper = false;
  updatePlugin = false;

  installLoading = false;

  constructor(updateService: UpdateService) {
    (async () => {
      this.isInstalled = await api.isInstalled();
      this.updateInfo = await api.getUpdateInfo();

      this.currentVersions = updateService.currentVersions;
      this.updateCranberriGui = this.updateInfo.cranberriGuiVersion != this.currentVersions.cranberriGuiVersion;
      this.updatePaper = this.updateInfo.paperVersion != this.currentVersions.paperVersion;
      this.updatePlugin = this.updateInfo.pluginVersion != this.currentVersions.pluginVersion;
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
