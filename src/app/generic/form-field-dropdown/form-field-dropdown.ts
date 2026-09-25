import { Component, OnInit, input, signal, inject, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IDropDownTemplate } from '../../stuctures/screens/edit/i-edit-form-settings';
import { GenericService } from '../../http/generic.service';
import { SettingsService } from '../../http/settings.service';
import { ISelectorFlowResponse } from '../../stuctures/i-selector-flow-response';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  imports: [DropDownListComponent],
  providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => FormFieldDropdown),
        }
    ],
  selector: 'app-form-field-dropdown',
  styleUrl: './form-field-dropdown.css',
  templateUrl: './form-field-dropdown.html',
})
export class FormFieldDropdown implements OnInit, ControlValueAccessor {
  public dropDownTemplateInputSignal = input.required<IDropDownTemplate>();
  public textFieldInputSignal = input.required<string>();
  public valueFieldInputSignal = input.required<string>();
  public filterValueSourceItemInputSignal = input<any>({});
  public modelTypeInputSignal = input<any>({});

  public reloadInputSignal = input<string>(''); 
  public clearInputSignal = input<string>('');

  constructor()
  {
    this.onTouched = () => { };
    this.onChange = (_: any) => {};
    this.disabled = false;
  }

  private readonly _genericService = inject(GenericService); 
  private readonly _settingsService = inject(SettingsService);

  public dataSignal = signal<any>(null);
  public defaultItem: any;
  private selectedItem: any;
  public disabled: boolean;
  public onChange: Function;
  private onTouched: Function;
  
  ngOnInit()
  {
    this.setDefaultItem();
    this.getDropDownData();
  }

  writeValue(obj: any): void
  {
    this.selectedValue = obj;
  }

  registerOnChange(fn: any): void
  {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void
  {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void
  {
    this.disabled = isDisabled;
  }

  public get selectedValue(): any
  {
    return this.selectedItem;
  }

  public set selectedValue(value:  any)
  {//this hack means angulat gets notified when the value gets set to null.
    //The underlying value does not always change when the user changes the value from the default null item to another item in the list.
    if ((value === null || value === undefined) && (this.selectedItem === null || this.selectedItem === undefined))
    {
      if (value !== this.selectedItem)
        this.selectedItem = value;
      else
        this.selectedItem = value === undefined ? null : undefined;
    }
    else {
      this.selectedItem = value;
    }
  }

  public setDefaultItem(): any
  {
    this.defaultItem = this.textFieldInputSignal() == this.valueFieldInputSignal()
      ? {
        [this.textFieldInputSignal()]: this.dropDownTemplateInputSignal().placeHolderText
      }
      : {
        [this.textFieldInputSignal()]: this.dropDownTemplateInputSignal().placeHolderText,
        [this.valueFieldInputSignal()]: null
      };
  }

  getDropDownData(): any
  {
    if (!(this.filterValueSourceItemInputSignal() && this.dropDownTemplateInputSignal().reloadItemsFlowName))
    {
      this.getList(this.dropDownTemplateInputSignal().textAndValueSelector);
      return;
    }

    this._settingsService.getSelector({ entity: { typeString: this.modelTypeInputSignal(), ...this.filterValueSourceItemInputSignal() }, reloadItemsFlowName: this.dropDownTemplateInputSignal().reloadItemsFlowName}).subscribe((selectorResponse: ISelectorFlowResponse) => {
      if (selectorResponse.success)
      {
        this.getList(selectorResponse.selector);
      }
    });
  }

  getList(selector: any) : void{
    this._genericService.getList(this.dropDownTemplateInputSignal().requestDetails, selector).subscribe(r =>
      {
        this.dataSignal.set(r);
        
        console.log("this.filterCellTemplate Returned:   " + JSON.stringify(this.dataSignal()));
        console.log("this.textField:   " + JSON.stringify(this.textFieldInputSignal()));
        console.log("this.valueField:   " + JSON.stringify(this.valueFieldInputSignal()));
      });
  }
}
