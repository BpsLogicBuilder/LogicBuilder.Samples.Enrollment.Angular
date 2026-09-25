import { Component, OnInit, ViewChild, input, inject, signal, TemplateRef } from '@angular/core';
import { IDetailFormSettings, detailKind, IDetailInputFieldSetting, IDetailValueTextSetting, IDetailListSetting, IDetailGroupSetting } from '../../stuctures/screens/detail/i-detail-form-settings';
import { ICommandButton } from '../../stuctures/i-command-button';
import { GenericService } from '../../http/generic.service';
import { UiNotificationService } from '../../common/ui-notification.service';
import { EntityType } from '../../stuctures/screens/i-base-model';
import { ViewTypeEnum } from '../../stuctures/screens/i-view-type';
import { NgTemplateOutlet, CurrencyPipe, DatePipe } from '@angular/common';
import { DisplayDropdownValue } from '../display-dropdown-value/display-dropdown-value';
import { IsDetailFormFieldPipe } from '../../pipes/is-detail-form-field-pipe';
import { IsGroupDetailPipe } from '../../pipes/is-group-detail-pipe';
import { IsInputDetailPipe } from '../../pipes/is-input-detail-pipe';
import { IsListDetailPipe } from '../../pipes/is-list-detail-pipe';
import { IsValueTextDetailPipe } from '../../pipes/is-value-text-detail-pipe';

@Component({
  imports: [IsDetailFormFieldPipe, IsGroupDetailPipe, IsInputDetailPipe, IsListDetailPipe, IsValueTextDetailPipe, NgTemplateOutlet, DisplayDropdownValue, CurrencyPipe, DatePipe],
  selector: 'app-generic-delete',
  styleUrl: './generic-delete.css',
  templateUrl: './generic-delete.html',
})
export class GenericDelete implements OnInit 
{
  @ViewChild('currencyTemplate', { static: true }) currencyTemplate!: TemplateRef<any>;
  @ViewChild('textTemplate', { static: true }) textTemplate!: TemplateRef<any>;
  @ViewChild('valueTextTemplate', { static: true }) valueTextTemplate!: TemplateRef<any>;
  @ViewChild('booleanTemplate', { static: true }) booleanTemplate!: TemplateRef<any>;
  @ViewChild('dateTemplate', { static: true }) dateTemplate!: TemplateRef<any>;
  @ViewChild('listTemplate', { static: true }) listTemplate!: TemplateRef<any>;
  @ViewChild('groupTemplate', { static: true }) groupTemplate!: TemplateRef<any>;

  public settingsInputSignal = input.required<IDetailFormSettings>();
  public commandButtonsInputSignal = input.required<ICommandButton[]>();

  private readonly _genericService = inject(GenericService);
  private readonly _uiNotificationService = inject(UiNotificationService);

  public detailType = detailKind;
  public entitySignal = signal<EntityType | null>(null);
  public errorMessageSignal = signal<string | null>(null);
  public formSettingsSignal = signal<IDetailFormSettings | null>(null);

  public getTemplate(templateName: string) : TemplateRef<any> {
    const templateMap: Record<string, TemplateRef<any>> = {
      'currencyTemplate': this.currencyTemplate,
      'textTemplate': this.textTemplate,
      'valueTextTemplate': this.valueTextTemplate,
      'booleanTemplate': this.booleanTemplate,
      'dateTemplate': this.dateTemplate,
      'listTemplate': this.listTemplate,
      'groupTemplate': this.groupTemplate
    };

    return templateMap[templateName];
  }

  public getInputFieldContext(entity: EntityType, fieldSetting: IDetailInputFieldSetting) {
    return {
      $implicit: entity,
      fieldSetting: fieldSetting
    }
  }

  public getValueTextContext(entity: EntityType, fieldSetting: IDetailValueTextSetting) { //NOSONAR - these methods do not have the same purpose
    return {
      $implicit: entity,
      fieldSetting: fieldSetting
    }
  }

  public getGroupContext(entity: EntityType, fieldSetting: IDetailGroupSetting) {
    return {
      $implicit: entity[fieldSetting.field],
      fieldSetting: fieldSetting
    }
  }

  public getListContext(entity: EntityType, fieldSetting: IDetailListSetting) {//NOSONAR - each method has a different purpose
    return {
      $implicit: entity[fieldSetting.field],
      fieldSetting: fieldSetting
    }
  }

  ngOnInit() {
    this.formSettingsSignal.set(this.settingsInputSignal());
    this.getItem();
  }

  getItem() {
    this._genericService.getItem(this.formSettingsSignal()?.requestDetails || {}).subscribe({
      next: itm => {
        this.entitySignal.set(itm);
      },
      error: error => this.errorMessageSignal.set(<any>error)});
  }

  submitClick(button: ICommandButton) {
    this._genericService.deleteItem(<EntityType>this.entitySignal(), this.formSettingsSignal()?.requestDetails || {})
      .subscribe({next: response => {
        this._uiNotificationService.navigateNext({
          viewType: ViewTypeEnum.Delete,
          commandButtonRequest: { newSelection: button.shortString, cancel: button.cancel || false }
        });
      },
      error: error => this.errorMessageSignal.set(<any>error)});
  }

  navigateNext(button: ICommandButton) {
    this._uiNotificationService.navigateNext({
      viewType: ViewTypeEnum.Delete,
      commandButtonRequest: { newSelection: button.shortString, cancel: button.cancel || false }
    });
  }
}
