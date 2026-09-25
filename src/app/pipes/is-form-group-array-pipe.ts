import { Pipe, PipeTransform } from '@angular/core';
import { abstractControlKind, IFormItemSetting, IFormGroupArraySettings } from '../stuctures/screens/edit/i-edit-form-settings';

@Pipe({
  name: 'isFormGroupArray',
})
export class IsFormGroupArrayPipe implements PipeTransform {
  transform(setting: IFormItemSetting): setting is IFormGroupArraySettings {
    return setting.abstractControlType == abstractControlKind.formGroupArray;
  }
}
