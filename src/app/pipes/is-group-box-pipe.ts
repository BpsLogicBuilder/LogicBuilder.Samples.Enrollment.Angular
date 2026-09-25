import { Pipe, PipeTransform } from '@angular/core';
import { abstractControlKind, IFormItemSetting, IGroupBoxSettings } from '../stuctures/screens/edit/i-edit-form-settings';

@Pipe({
  name: 'isGroupBox',
})
export class IsGroupBoxPipe implements PipeTransform {
  transform(setting: IFormItemSetting): setting is IGroupBoxSettings {
    return setting.abstractControlType == abstractControlKind.groupBox;
  }
}
