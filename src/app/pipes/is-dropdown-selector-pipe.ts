import { Pipe, PipeTransform } from '@angular/core';
import { abstractControlKind, IFormItemSetting, IDropdownSelectorControlSettings } from '../stuctures/screens/edit/i-edit-form-settings';

@Pipe({
  name: 'isDropdownSelector',
})
export class IsDropdownSelectorPipe implements PipeTransform {
  transform(setting: IFormItemSetting): setting is IDropdownSelectorControlSettings {
    return setting.abstractControlType == abstractControlKind.dropdownSelectorControl;
  }
}
