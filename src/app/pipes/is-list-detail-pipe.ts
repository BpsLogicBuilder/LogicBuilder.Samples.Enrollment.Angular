import { Pipe, PipeTransform } from '@angular/core';
import { detailKind, IDetailItem, IDetailListSetting } from '../stuctures/screens/detail/i-detail-form-settings';

@Pipe({
  name: 'isListDetail',
})
export class IsListDetailPipe implements PipeTransform {
  transform(setting: IDetailItem): setting is IDetailListSetting {
      return setting.detailType === detailKind.list;
  }
}
