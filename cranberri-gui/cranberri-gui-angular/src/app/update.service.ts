import {Injectable} from '@angular/core';
import {UpdateInfo} from "./api";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, first, forkJoin, Observable} from "rxjs";
import {get, nonnull} from "./util";

const notFound = "<not found".concat(">");

export type NeedsUpdateInfo = {
  cranberriGui: boolean,
  paper: boolean,
  plugin: boolean
};

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  isInstalled$ = new BehaviorSubject<boolean | null>(null);
  updateInfo$ = new BehaviorSubject<UpdateInfo | null>(null);

  updateAvailable$ = new BehaviorSubject<boolean | null>(null);
  currentVersions$ = new BehaviorSubject<UpdateInfo | null>(null);

  constructor(http: HttpClient) {
    api.getIsInstalled().then(isInstalled => this.isInstalled$.next(isInstalled));
    api.handleIsInstalled((_, isInstalled) => {
      this.isInstalled$.next(isInstalled);
    });

    get(this.isInstalled$).subscribe(isInstalled => {
      if (isInstalled) api.getUpdateInfo().then(updateInfo => this.updateInfo$.next(updateInfo));
    });
    api.handleUpdateInfo((_, updateInfo) => {
      this.updateInfo$.next(updateInfo);
    });

    forkJoin({
      cranberriGuiVersion: new Observable(subscriber => {
        http.get<any>("https://api.github.com/repos/JupiterPi/cranberri-gui/releases/latest").subscribe(data => {
          subscriber.next(data["tag_name"].substring("v".length));
        }, () => {
          subscriber.next(notFound);
        });
      }).pipe(first()),
      paperVersion: new Observable(subscriber => {
        http.get("https://raw.githubusercontent.com/JupiterPi/cranberri/main/paper_version", {responseType: "text"}).subscribe(version => {
          subscriber.next(version.trim());
        }, () => {
          subscriber.next(notFound);
        });
      }).pipe(first()),
      pluginVersion: new Observable(subscriber => {
        http.get<any>("https://api.github.com/repos/JupiterPi/cranberri/releases/latest").subscribe(data => {
          subscriber.next(data["tag_name"].substring("v".length));
        }, () => {
          subscriber.next(notFound);
        });
      }).pipe(first()),
    }).subscribe(results => {
      this.currentVersions$.next(results as UpdateInfo);
    }, error => {
      console.error(error);
    });

    nonnull(this.isInstalled$).subscribe(isInstalled => {
      if (!isInstalled) this.updateAvailable$.next(false);
    });
    nonnull(this.updateInfo$).subscribe(updateInfo => {
      get(this.currentVersions$).subscribe(currentVersions => {
        const needsUpdate = this.needsUpdate(updateInfo, currentVersions);
        this.updateAvailable$.next(needsUpdate.cranberriGui || needsUpdate.paper || needsUpdate.plugin);
      });
    });
  }

  needsUpdate(updateInfo: UpdateInfo, currentVersions: UpdateInfo): NeedsUpdateInfo {
    return {
      cranberriGui: updateInfo.cranberriGuiVersion != currentVersions.cranberriGuiVersion,
      paper: !(updateInfo.paperVersion.startsWith(currentVersions.paperVersion)),
      plugin: updateInfo.pluginVersion != currentVersions.pluginVersion
    };
  }
}
