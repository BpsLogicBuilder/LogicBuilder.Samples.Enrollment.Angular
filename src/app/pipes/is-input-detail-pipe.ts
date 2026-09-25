import { Pipe, PipeTransform } from '@angular/core';
import { detailKind, IDetailItem, IDetailInputFieldSetting } from '../stuctures/screens/detail/i-detail-form-settings';

@Pipe({
  name: 'isInputDetail',
})
export class IsInputDetailPipe implements PipeTransform {
  transform(setting: IDetailItem): setting is IDetailInputFieldSetting {
    return setting.detailType === detailKind.field 
      && 'fieldTemplate' in setting && setting['fieldTemplate'];
  }
}
