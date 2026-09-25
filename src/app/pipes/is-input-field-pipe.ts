import { Pipe, PipeTransform } from '@angular/core';
import { abstractControlKind, IFormItemSetting, IInputFieldControlSettings } from '../stuctures/screens/edit/i-edit-form-settings';

@Pipe({
  name: 'isInputField',
})
export class IsInputFieldPipe implements PipeTransform {
  transform(setting: IFormItemSetting): setting is IInputFieldControlSettings {
    return setting.abstractControlType == abstractControlKind.inputFieldControl;
  }
}
