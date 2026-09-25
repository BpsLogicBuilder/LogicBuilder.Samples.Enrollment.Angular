import { Pipe, PipeTransform } from '@angular/core';
import { detailKind, IDetailItem, IDetailFieldSetting } from '../stuctures/screens/detail/i-detail-form-settings';

@Pipe({
  name: 'isDetailFormField',
})
export class IsDetailFormFieldPipe implements PipeTransform {
  transform(setting: IDetailItem): setting is IDetailFieldSetting {
    return setting.detailType === detailKind.field;
  }
}
