import { Injectable } from '@angular/core';
import {UpdateInfo} from "./api";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, filter, first, forkJoin, Observable} from "rxjs";
import {isNonNull} from "./util";

const notFound = "<not found".concat(">");

export type NeedsUpdateInfo = {
  cranberriGui: boolean,
  updatePaper: boolean,
  updatePlugin: boolean
};

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  updateAvailable = false;
  currentVersions$ = new BehaviorSubject<UpdateInfo | null>(null);

  getCurrentVersions() {
    return this.currentVersions$.pipe(filter(isNonNull), first());
  }

  constructor(http: HttpClient) {
    forkJoin({
      cranberriGuiVersion: new Observable(subscriber => {
        http.get<any>("https://api.github.com/repos/JupiterPi/cranberri-gui/releases/latest").subscribe(data => {
          subscriber.next(data["tag_name"].substring("v".length));
        }, () => {
          subscriber.next(notFound)
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
          subscriber.next(notFound)
        });
      }).pipe(first()),
    }).subscribe(results => {
      this.currentVersions$.next(results as UpdateInfo);
    }, error => {
      console.error(error);
    });
  }

  needsUpdate(updateInfo: UpdateInfo, currentVersions: UpdateInfo): NeedsUpdateInfo {
    return {
      cranberriGui: updateInfo.cranberriGuiVersion != currentVersions.cranberriGuiVersion,
      updatePaper: !(updateInfo.paperVersion.startsWith(currentVersions.paperVersion)),
      updatePlugin: updateInfo.pluginVersion != currentVersions.pluginVersion
    };
  }
}
