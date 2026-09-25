import { Component, OnInit, inject, input, signal, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { IMultiSelectTemplate } from '../../stuctures/screens/edit/i-edit-form-settings';
import { GenericService } from '../../http/generic.service';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  imports: [MultiSelectComponent],
  providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => FormFieldMultiselect),
        }
    ],
  selector: 'app-form-field-multiselect',
  styleUrl: './form-field-multiselect.css',
  templateUrl: './form-field-multiselect.html',
})
export class FormFieldMultiselect implements OnInit, ControlValueAccessor {

  constructor() {
    this.onTouched = () => { };
    this.onChange = (_: any) => {};
    this.disabled = false;
  }

  private readonly _genericService = inject(GenericService);

  public multiSelectTemplateInputSignal = input.required<IMultiSelectTemplate>();
  public textFieldInputSignal = input.required<string>();
  public valueFieldInputSignal = input.required<string>();
  public filterValueSourceItem = input<any>(null);

  public dataSignal = signal<any>(null);
  public placeholderSignal = signal<string | null>(null);
  public onChange: Function; 
  
  private selectedItems: any;
  private disabled: boolean;
  private onTouched: Function;

  ngOnInit() {
    this.getDropDownData();
    this.placeholderSignal.set(this.multiSelectTemplateInputSignal()?.placeHolderText);
  }

  writeValue(obj: any): void {
    this.selectedItems = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn; 
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn; 
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public get selectedValues(): any {
    return this.selectedItems;
  }

  public onValueChange(value : any) {
    console.log("valueChange : ", value);
  }

  getDropDownData(): any {
    this._genericService.getList(this.multiSelectTemplateInputSignal().requestDetails, this.multiSelectTemplateInputSignal().textAndValueSelector).subscribe(r => {
      this.dataSignal.set(r);
      console.log("this.multiSelectTemplate Returned:   " + JSON.stringify(this.dataSignal()));
      console.log("this.textField:   " + JSON.stringify(this.textFieldInputSignal()));
      console.log("this.valueField:   " + JSON.stringify(this.valueFieldInputSignal()));
    });
  }
}
