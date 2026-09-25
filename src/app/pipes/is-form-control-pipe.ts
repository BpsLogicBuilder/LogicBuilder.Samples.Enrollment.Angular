import { Pipe, PipeTransform } from '@angular/core';
import { abstractControlKind, IFormItemSetting, IFormControlSettings } from '../stuctures/screens/edit/i-edit-form-settings';

@Pipe({
  name: 'isFormControl',
})
export class IsFormControlPipe implements PipeTransform {
  transform(setting: IFormItemSetting): setting is IFormControlSettings {
    return setting.abstractControlType == abstractControlKind.inputFieldControl
      || setting.abstractControlType == abstractControlKind.dropdownSelectorControl
      || setting.abstractControlType == abstractControlKind.multiSelectFormControl;
  }
}
