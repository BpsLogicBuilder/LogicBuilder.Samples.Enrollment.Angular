import { Pipe, PipeTransform } from '@angular/core';
import { abstractControlKind, IFormItemSetting, IFormGroupSettings } from '../stuctures/screens/edit/i-edit-form-settings';

@Pipe({
  name: 'isFormGroup',
})
export class IsFormGroupPipe implements PipeTransform {
  transform(setting: IFormItemSetting): setting is IFormGroupSettings {
    return setting.abstractControlType == abstractControlKind.formGroup;
  }
}
