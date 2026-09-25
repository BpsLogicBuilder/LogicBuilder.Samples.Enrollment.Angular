import { Pipe, PipeTransform } from '@angular/core';
import { abstractControlKind, IFormItemSetting, IMultiSelectFormControlSettings } from '../stuctures/screens/edit/i-edit-form-settings';

@Pipe({
  name: 'isMultiSelect',
})
export class IsMultiSelectPipe implements PipeTransform {
  transform(setting: IFormItemSetting): setting is IMultiSelectFormControlSettings {
    return setting.abstractControlType == abstractControlKind.multiSelectFormControl;
  }
}
