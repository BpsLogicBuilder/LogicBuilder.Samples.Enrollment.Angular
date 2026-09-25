import { Component, inject, OnInit } from '@angular/core';
import { UiNotificationService } from '../common/ui-notification.service';
import { ViewTypeEnum } from '../stuctures/screens/i-view-type';
import { GenericGrid } from '../generic/generic-grid/generic-grid';
import { GenericCreate } from '../generic/generic-create/generic-create';
import { GenericEdit } from '../generic/generic-edit/generic-edit';
import { GenericDetail } from '../generic/generic-detail/generic-detail';
import { GenericDelete } from '../generic/generic-delete/generic-delete';
import { HtmlPage } from '../html-page/html-page';
import { GenericList } from '../generic/generic-list/generic-list';

@Component({
  imports: [GenericGrid, GenericCreate, GenericEdit, GenericDetail, GenericDelete, HtmlPage, GenericList],
  selector: 'app-screen-host',
  styleUrl: './screen-host.css',
  templateUrl: './screen-host.html',
})
export class ScreenHost implements OnInit  {

  private readonly _notificationService = inject(UiNotificationService);
  public viewType = ViewTypeEnum;
  protected readonly screenSettingsSignal = this._notificationService.screenSettings;

  ngOnInit() {
    this._notificationService.start();
  }

}
