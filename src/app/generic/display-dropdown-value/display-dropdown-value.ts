import { Component, OnInit, input, signal, inject } from '@angular/core';
import { GenericService } from '../../http/generic.service';
import { IDetailDropDownTemplate } from '../../stuctures/screens/detail/i-detail-form-settings';
import { SettingsService } from '../../http/settings.service';
import { ISelectorFlowResponse } from '../../stuctures/i-selector-flow-response';

@Component({
  imports: [],
  selector: '[app-display-dropdown-value]',
  styleUrl: './display-dropdown-value.css',
  templateUrl: './display-dropdown-value.html',
})
export class DisplayDropdownValue implements OnInit 
{
  public valueTextTemplateInputSignal = input.required<IDetailDropDownTemplate>();
  public filterValueSourceItemInputSignal = input<any>(null);
  public selectedValueInputSignal = input.required<any>();
  public modelTypeInputSignal = input<any>(null);

  private readonly _genericService = inject(GenericService); 
  private readonly _settingsService = inject(SettingsService);

  public selectedTextSignal = signal<string | null>(null);
  public dataSignal = signal<any>(null);

  ngOnInit() {
    this.getDropDownData();
  }

  getDropDownData(): any
  {
    if (!(this.filterValueSourceItemInputSignal() && this.valueTextTemplateInputSignal()?.reloadItemsFlowName))
    {
      this.getList(this.valueTextTemplateInputSignal()?.textAndValueSelector);
      return;
    }

    this._settingsService.getSelector({ entity: {typeString: this.modelTypeInputSignal(), ...this.filterValueSourceItemInputSignal()}, reloadItemsFlowName: this.valueTextTemplateInputSignal().reloadItemsFlowName}).subscribe((selectorResponse: ISelectorFlowResponse) => {
      if (selectorResponse.success)
      {
        this.getList(selectorResponse.selector);
      }
    });
  }

  getList(selector: any) : void{
    this._genericService.getList(this.valueTextTemplateInputSignal()?.requestDetails || {}, selector).subscribe(r =>
      {
        this.dataSignal.set(r);
        const data = this.dataSignal();
        if(data?.length && this.valueTextTemplateInputSignal())
        {
          const valueTextTemplate = this.valueTextTemplateInputSignal();
          let selected = data.find((i: Record<string, any>) => i[valueTextTemplate.valueField] == this.selectedValueInputSignal());
          this.selectedTextSignal.set(selected ? selected[valueTextTemplate.textField] : "");
        }
        console.log("this.filterCellTemplate Returned:   " + JSON.stringify(data));
      });
  }
}
