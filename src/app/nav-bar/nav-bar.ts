import { Component, inject } from '@angular/core';
import { UiNotificationService } from '../common/ui-notification.service';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap/collapse';
import { NgClass } from '@angular/common';

@Component({
  imports: [NgbCollapse, NgClass],
  selector: 'app-nav-bar',
  styleUrl: './nav-bar.css',
  templateUrl: './nav-bar.html',
})
export class NavBar {
  private readonly _notificationService = inject(UiNotificationService);
  protected readonly navBarSignal = this._notificationService.navBar;

  public isCollapsed: boolean = false;

  menuItemClick(stage: number, mod: string) {
    console.log("menuItemClick");
    this._notificationService.navStart({
      initialModuleName: mod,
      targetModule: stage
    });
  }

  doNothing() {
    console.log("Do Nothing");
  }
}
