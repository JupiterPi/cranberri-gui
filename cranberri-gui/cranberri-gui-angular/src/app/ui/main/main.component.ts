import {Component} from '@angular/core';
import {UpdateService} from "../../update.service";
import {nonnull} from "../../util";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  isInstalled$ = nonnull(this.updateService.isInstalled$);

  constructor(private updateService: UpdateService) {}
}
