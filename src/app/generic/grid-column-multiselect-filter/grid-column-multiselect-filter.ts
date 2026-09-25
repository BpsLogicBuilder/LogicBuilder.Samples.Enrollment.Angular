import { Component, OnInit, EventEmitter, inject, input, Output } from '@angular/core';
import { CompositeFilterDescriptor, distinct, filterBy, FilterDescriptor } from '@progress/kendo-data-query';
import { FilterService } from '@progress/kendo-angular-grid';
import { GenericService } from '../../http/generic.service';
import { NgClass } from '@angular/common';

@Component({
  imports: [NgClass],
  selector: 'app-grid-column-multiselect-filter',
  styleUrl: './grid-column-multiselect-filter.css',
  templateUrl: './grid-column-multiselect-filter.html',
})
export class GridColumnMultiselectFilter implements OnInit {
  private readonly _genericService = inject(GenericService);

  public isPrimitiveInputSignal = input.required<boolean>();
  public currentFilterInputSignal = input.required<CompositeFilterDescriptor>();;
  public filterMenuTemplateInputSignal = input.required<any>();
  public textFieldInputSignal = input.required<string>();
  public valueFieldInputSignal = input.required<string>();
  public filterServiceInputSignal = input.required<FilterService>();
  public fieldInputSignal = input.required<string>();
  @Output() public valueChange = new EventEmitter<number[]>();

  public data: any;
  public currentData: any;
  public showFilter = true;
  private value: any[] = [];

  ngOnInit() {
    this.getFilterData();
  }

  protected textAccessor = (dataItem: any) => this.isPrimitiveInputSignal() ? dataItem : dataItem[this.textFieldInputSignal()];
  protected valueAccessor = (dataItem: any) => this.isPrimitiveInputSignal() ? dataItem : dataItem[this.valueFieldInputSignal()];

  public isItemSelected(item : any) {
    return this.value.includes(this.valueAccessor(item));
  }

  public onSelectionChange(item : any) {
    if (this.value.includes(item)) {
      this.value = this.value.filter(x => x !== item);
    } else {
      this.value.push(item);
    }

    this.filterServiceInputSignal().filter({
      filters: this.value.map(value => ({
        field: this.fieldInputSignal(),
        operator: 'eq',
        value
      })),
      logic: 'or'
    });
  }

  public onInput(e: any) {
    this.currentData = distinct([
      ...this.currentData.filter((dataItem : any) => this.value.includes(this.valueAccessor(dataItem))),
      ...filterBy(this.data, {
        operator: 'contains',
        field: this.textFieldInputSignal(),
        value: e.target.value
      })],
      this.textFieldInputSignal()
    );
  }

  getFilterData(): any {
    this._genericService.getList(this.filterMenuTemplateInputSignal().requestDetails, this.filterMenuTemplateInputSignal().textAndValueSelector).subscribe(r => {
      this.data = r;
      console.log("this.MultiSelect Returned:   " + JSON.stringify(this.data));

      this.currentData = this.data;
      this.value = (this.currentFilterInputSignal()?.filters ?? [])
        .filter((f): f is FilterDescriptor => 'operator' in f)//if the f item has an operator property then it is of type FilterDescriptor
        .map((f) => f.value);

      this.showFilter = typeof this.textAccessor(this.currentData[0]) === 'string';
    });
  }
}
