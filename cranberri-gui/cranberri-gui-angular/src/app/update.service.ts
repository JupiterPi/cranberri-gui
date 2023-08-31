import { Injectable } from '@angular/core';
import {UpdateInfo} from "./api";

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  updateAvailable = false;
  currentVersions: UpdateInfo = {
    cranberriGuiVersion: "0.0.1",
    paperVersion: "1.19.4-550a",
    pluginVersion: "0.0.3",
  }; //TODO proper

  constructor() {}
}
