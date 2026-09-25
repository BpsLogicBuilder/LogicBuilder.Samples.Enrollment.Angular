import { Component, OnInit, input, inject, signal, ViewChild, TemplateRef } from '@angular/core';
import { GenericService } from '../../http/generic.service';
import { UiNotificationService } from '../../common/ui-notification.service';
import { IListFormSettings } from '../../stuctures/screens/list/i-list-form-settings';
import { ICommandButton } from '../../stuctures/i-command-button';
import { IDetailFieldSetting, IDetailItem, detailKind } from '../../stuctures/screens/detail/i-detail-form-settings';
import { ViewTypeEnum } from '../../stuctures/screens/i-view-type';
import { NgTemplateOutlet, DatePipe } from '@angular/common';

@Component({
  imports: [NgTemplateOutlet, DatePipe],
  selector: 'app-generic-list',
  styleUrl: './generic-list.css',
  templateUrl: './generic-list.html',
})
export class GenericList implements OnInit {
  @ViewChild('textTemplate', { static: true }) textTemplate!: TemplateRef<any>;
  @ViewChild('dateTemplate', { static: true }) dateTemplate!: TemplateRef<any>;

  public settingsInputSignal = input.required<IListFormSettings>();
  public commandButtonsInputSignal = input.required<ICommandButton[]>();

  private readonly _genericService = inject(GenericService);
  private readonly _uiNotificationService = inject(UiNotificationService);

  public listDataSignal = signal<any>(null);

  public getTemplate(templateName: string) : TemplateRef<any> {
    const templateMap: Record<string, TemplateRef<any>> = {
      'textTemplate': this.textTemplate,
      'dateTemplate': this.dateTemplate
    };

    return templateMap[templateName];
  }

  public getFieldContext(entity: any, fieldSetting: IDetailFieldSetting) {
    return {
      $implicit: entity,
      fieldSetting: fieldSetting
    }
  }

  public filterForFormFieldSettings(fieldSettings: IDetailItem[]) : IDetailFieldSetting[] {
    return fieldSettings.filter(
      (item): item is IDetailFieldSetting => item.detailType === detailKind.field
    );
  }

  ngOnInit() {
    this.getItems();
  }

  getItems() {
    this._genericService.getList(this.settingsInputSignal().requestDetails, this.settingsInputSignal().fieldsSelector).subscribe(r => {
      this.listDataSignal.set(r);
    });
  }

  navigateNext(button: ICommandButton) {
    this._uiNotificationService.navigateNext({
      viewType: ViewTypeEnum.List,
      commandButtonRequest: { newSelection: button.shortString, cancel: button.cancel || false }
    });
  }
}
