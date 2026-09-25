import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, input, inject, signal } from '@angular/core';
import { IEditFormSettings, abstractControlKind, IFormGroupData, IFormItemSetting, IFormGroupSettings, IFormGroupArraySettings, IInputFieldControlSettings, IDropdownSelectorControlSettings, IMultiSelectFormControlSettings } from '../../stuctures/screens/edit/i-edit-form-settings';
import { ICommandButton } from '../../stuctures/i-command-button';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormArray, ReactiveFormsModule } from '@angular/forms';
import { GenericService } from '../../http/generic.service';
import { UiNotificationService } from '../../common/ui-notification.service';
import { ListManagerService } from '../../common/list-manager.service';
import { EntityType } from '../../stuctures/screens/i-base-model';
import { ObjectHelper } from '../../common/object-helper';
import { debounceTime } from 'rxjs/operators';
import { ViewTypeEnum } from '../../stuctures/screens/i-view-type';
import { EditFormHelpers } from '../../common/edit-form-helpers';
import { Directives } from '../../common/directives';
import { DateService } from '../../common/date.service';
import { NgTemplateOutlet } from '@angular/common';
import { DatePickerComponent } from '@progress/kendo-angular-dateinputs';
import { KENDO_LABEL } from '@progress/kendo-angular-label';
import { FormFieldDropdown } from '../form-field-dropdown/form-field-dropdown';
import { FormFieldMultiselect } from '../form-field-multiselect/form-field-multiselect';
import { IsInputFieldPipe } from '../../pipes/is-input-field-pipe';
import { IsDropdownSelectorPipe } from '../../pipes/is-dropdown-selector-pipe';
import { IsMultiSelectPipe } from '../../pipes/is-multi-select-pipe';
import { IsFormControlPipe } from '../../pipes/is-form-control-pipe';
import { IsFormGroupPipe} from '../../pipes/is-form-group-pipe';
import { IsFormGroupArrayPipe } from '../../pipes/is-form-group-array-pipe';
import { IsGroupBoxPipe } from '../../pipes/is-group-box-pipe';

@Component({
  imports: [IsFormGroupPipe, IsFormGroupArrayPipe, IsGroupBoxPipe, IsInputFieldPipe, IsDropdownSelectorPipe, IsMultiSelectPipe, IsFormControlPipe, ReactiveFormsModule, NgTemplateOutlet, DatePickerComponent, KENDO_LABEL, FormFieldDropdown, FormFieldMultiselect],
  selector: 'app-generic-create',
  styleUrl: './generic-create.css',
  templateUrl: './generic-create.html',
})
export class GenericCreate implements OnInit, AfterViewInit {
  @ViewChild('labelTemplate', { static: true }) labelTemplate!: TemplateRef<any>;
  @ViewChild('textTemplate', { static: true }) textTemplate!: TemplateRef<any>;
  @ViewChild('dateTemplate', { static: true }) dateTemplate!: TemplateRef<any>;
  @ViewChild('checkBoxTemplate', { static: true }) checkBoxTemplate!: TemplateRef<any>;
  @ViewChild('dropDownTemplate', { static: true }) dropDownTemplate!: TemplateRef<any>;
  @ViewChild('multiSelectTemplate', { static: true }) multiSelectTemplate!: TemplateRef<any>;
  @ViewChild('formGroupTemplate', { static: true }) formGroupTemplate!: TemplateRef<any>;
  @ViewChild('formArrayTemplate', { static: true }) formArrayTemplate!: TemplateRef<any>;
  @ViewChild('hiddenTemplate', { static: true }) hiddenTemplate!: TemplateRef<any>;

  public settingsInputSignal = input.required<IEditFormSettings>();
  public commandButtonsInputSignal = input.required<ICommandButton[]>();

  private readonly fb = inject(UntypedFormBuilder);
  private readonly _genericService = inject(GenericService);
  private readonly _dateService = inject(DateService);
  private readonly _uiNotificationService = inject(UiNotificationService);
  private readonly _listManagerService = inject(ListManagerService);

  public controlType = abstractControlKind;
  public errorMessageSignal = signal<string | null>(null);
  public itemFormSignal = signal<UntypedFormGroup | null>(null);
  public formSettingsSignal = signal<IEditFormSettings | null>(null);

  private formGroupData?: IFormGroupData;

  public getTemplate(templateName: string) : TemplateRef<any> {
    const templateMap: Record<string, TemplateRef<any>> = {
      'labelTemplate': this.labelTemplate,
      'textTemplate': this.textTemplate,
      'dateTemplate': this.dateTemplate,
      'checkBoxTemplate': this.checkBoxTemplate,
      'dropDownTemplate': this.dropDownTemplate,
      'multiSelectTemplate': this.multiSelectTemplate,
      'formGroupTemplate': this.formGroupTemplate,
      'formArrayTemplate': this.formArrayTemplate,
      'hiddenTemplate': this.hiddenTemplate
    };

    return templateMap[templateName];
  }

  public getNewIndex(oldStringIndex: string, index: number)
  {
    return oldStringIndex 
            ? oldStringIndex + '_' + String(index) 
            : String(index);
  }

  public getInputFieldContext(fieldSetting: IInputFieldControlSettings, formGroup: UntypedFormGroup, index?: string)
  {
    let fGroupData = EditFormHelpers.findFormGroupData(formGroup.controls[fieldSetting.field], <UntypedFormGroup>this.itemFormSignal(), <IFormItemSetting[]>(this.formSettingsSignal()!.fieldSettings), <IFormGroupData>this.formGroupData) || { displayMessages: {}};
    return {
      formGroup: formGroup,
      fieldSetting: fieldSetting,
      groupData: fGroupData,
      strIndex: index || ""
    }
  }

  public getFormGroupContext(fieldSetting: IFormItemSetting, formGroup: UntypedFormGroup, index?: string)
  {
    return {
      formGroup: formGroup.controls[fieldSetting['field']],
      fieldSetting: fieldSetting,
      strIndex: index || ""
    }
  }

  public getGroupBoxContext(fieldSetting: IFormItemSetting, formGroup: UntypedFormGroup, index?: string)
  {
    return {
      formGroup: formGroup,
      fieldSetting: fieldSetting,
      strIndex: index || ""
    }
  }

  public getFormArrayContext(fieldSetting: IFormGroupSettings, formGroup: UntypedFormGroup, index?: string)
  {
    return {
      formGroup: formGroup,
      arrayControl: formGroup.controls[fieldSetting.field],
      arrayName: fieldSetting.field,
      fieldSetting: fieldSetting,
      strIndex: index || ""
    }
  }

  public getDropDownFieldContext(fieldSetting: IDropdownSelectorControlSettings, formGroup: UntypedFormGroup, index?: string)
  {
    let fGroupData = EditFormHelpers.findFormGroupData(formGroup.controls[fieldSetting.field], <UntypedFormGroup>this.itemFormSignal(), <IFormItemSetting[]>this.formSettingsSignal()!.fieldSettings, <IFormGroupData>this.formGroupData) || { displayMessages: {}};

    return {
      formGroup: formGroup,
      fieldSetting: fieldSetting,
      dropDownTemplate: fieldSetting.dropDownTemplate,
      textField: fieldSetting.dropDownTemplate.textField,
      valueField: fieldSetting.dropDownTemplate.valueField,
      groupData: fGroupData,
      strIndex: index || ""
    }
  }

  public getMultiSelectFieldContext(fieldSetting: IMultiSelectFormControlSettings, formGroup: UntypedFormGroup, index?: string)
  {
    let fGroupData = EditFormHelpers.findFormGroupData(formGroup.controls[fieldSetting.field], <UntypedFormGroup>this.itemFormSignal(), <IFormItemSetting[]>this.formSettingsSignal()!.fieldSettings, <IFormGroupData>this.formGroupData) || { displayMessages: {}};
    return {
      formGroup: formGroup,
      fieldSetting: fieldSetting,
      multiSelectTemplate: fieldSetting.multiSelectTemplate,
      textField: fieldSetting.multiSelectTemplate.textField,
      valueField: fieldSetting.multiSelectTemplate.valueField,
      groupData: fGroupData,
      strIndex: index || ""
    }
  }

  public addFormArrayItem(formArray: UntypedFormArray, arraySettings: IFormGroupArraySettings): void {
    let formGroup: UntypedFormGroup = ObjectHelper.buildFormGroup(<IFormItemSetting[]>arraySettings.fieldSettings, this.fb);
    formArray.push(formGroup);

    Directives.watchFields(arraySettings, formGroup, arraySettings.conditionalDirectives || {}, this.fb);
    formGroup.patchValue(ObjectHelper.getPatchObject(formGroup, <IFormItemSetting[]>arraySettings.fieldSettings, <EntityType>{}, this._dateService, this.fb));
  }

  public deleteFormArrayItem(formArray: UntypedFormArray, index: number): void {
    formArray.removeAt(index);
    formArray.markAsDirty();
  }

  ngOnInit()
  {
    this.formSettingsSignal.set(this.settingsInputSignal());
    const formSettings = this.formSettingsSignal();
    this.itemFormSignal.set(ObjectHelper.buildFormGroup(<IFormItemSetting[]>formSettings!.fieldSettings, this.fb));
    const itemForm = this.itemFormSignal();

    Directives.watchFields(formSettings!, itemForm!, formSettings!.conditionalDirectives || {}, this.fb);
    //Don't patch value until data arrives otherwise - will have to re-insert controls with new values depending on the data for that to work
    //Why doesn't it work with watch fields.  Watch fields will show a control depending on the value of the control being watched - not the target.
    //Why not pass in value of the target control?  The target control (if it is hidden) has no value.
    //So how about the initial data loaded.  Possible - we'll have to find that object by a recursive search.
    //Seems ugly - don't know a simple way to get the full path given the Abstract control

    this.formGroupData = EditFormHelpers.getFormGroupData(itemForm!, <IFormItemSetting[]>formSettings!.fieldSettings);
    EditFormHelpers.processValidationMessages(itemForm!, <IFormItemSetting[]>formSettings!.fieldSettings, this.formGroupData, formSettings!.validationMessages || {});
  }

  ngAfterViewInit(): void
  {
    this.itemFormSignal()?.valueChanges.pipe(debounceTime(500)).subscribe(value =>
    {
      this.formGroupData = EditFormHelpers.getFormGroupData(<UntypedFormGroup>this.itemFormSignal(), <IFormItemSetting[]>this.formSettingsSignal()!.fieldSettings);
      EditFormHelpers.processValidationMessages(<UntypedFormGroup>this.itemFormSignal(), <IFormItemSetting[]>this.formSettingsSignal()!.fieldSettings, this.formGroupData, this.formSettingsSignal()?.validationMessages || {});
    });
  }

  submitClick(button: ICommandButton): void {
    if (!(this.itemFormSignal()?.dirty && this.itemFormSignal()!.valid))
      return;

    let itm: EntityType = {...this.itemFormSignal()!.value};
    itm = this._listManagerService.updateFormEntityState(itm, <EntityType>{}, <UntypedFormGroup>this.itemFormSignal(), <IFormItemSetting[]>this.formSettingsSignal()!.fieldSettings, true);
    itm.typeString = this.formSettingsSignal()!.modelType;

    this._genericService.insertItem(itm, this.formSettingsSignal()!.requestDetails).subscribe({
      next: response => this.navigateNext(button),
      error: error => this.errorMessageSignal.set(<any>error)
    });
  }

  navigateNext(button: ICommandButton) {
    this._uiNotificationService.navigateNext({
      viewType: ViewTypeEnum.Create,
      commandButtonRequest: { newSelection: button.shortString, cancel: button.cancel || false }
    });
  }

}
