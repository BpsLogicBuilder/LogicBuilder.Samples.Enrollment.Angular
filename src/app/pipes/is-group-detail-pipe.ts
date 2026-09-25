import { Pipe, PipeTransform } from '@angular/core';
import { detailKind, IDetailItem, IDetailGroupSetting } from '../stuctures/screens/detail/i-detail-form-settings';

@Pipe({
  name: 'isGroupDetail',
})
export class IsGroupDetailPipe implements PipeTransform {
  transform(setting: IDetailItem): setting is IDetailGroupSetting {
      return setting.detailType === detailKind.group;
  }
}
