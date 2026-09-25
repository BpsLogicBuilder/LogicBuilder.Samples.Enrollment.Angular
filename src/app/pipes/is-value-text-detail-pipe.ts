import { Pipe, PipeTransform } from '@angular/core';
import { detailKind, IDetailItem, IDetailValueTextSetting } from '../stuctures/screens/detail/i-detail-form-settings';

@Pipe({
  name: 'isValueTextDetail',
})
export class IsValueTextDetailPipe implements PipeTransform {
  transform(setting: IDetailItem): setting is IDetailValueTextSetting  {
    return setting.detailType === detailKind.field 
      && 'valueTextTemplate' in setting && setting['valueTextTemplate'];
  }
}
