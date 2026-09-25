import { Component, OnInit, input, inject } from '@angular/core';
import { BaseFilterCellComponent, FilterService } from '@progress/kendo-angular-grid';
import { GenericService } from '../../http/generic.service';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  imports: [DropDownListComponent],
  selector: 'app-grid-column-dropdown-filter',
  styleUrl: './grid-column-dropdown-filter.css',
  templateUrl: './grid-column-dropdown-filter.html',
})
export class GridColumnDropdownFilter extends BaseFilterCellComponent implements OnInit {
  private readonly _genericService = inject(GenericService);

  constructor() { 
    super(inject(FilterService));
  }
  
  public filterRowTemplateInputSignal = input.required<any>();
  public textFieldInputSignal = input.required<string>();
  public valueFieldInputSignal = input.required<string>();

  public data: any;

  ngOnInit() {
    this.getFilterData();
    this.setDefaultItem();
  }

  public get selectedValue(): any {
    const filter = this.filterByField(this.valueFieldInputSignal());
    return filter ? filter.value : null;
  }

  public defaultItem: any;
  public setDefaultItem(): any {
    this.defaultItem = this.textFieldInputSignal() == this.valueFieldInputSignal()
      ? {
        [this.textFieldInputSignal()]: 'Select item...'
      }
      : {
        [this.textFieldInputSignal()]: 'Select item...',
        [this.valueFieldInputSignal()]: null
      };
  }

  public onChange(value: any): void {
    this.applyFilter(
      value === this.defaultItem[this.valueFieldInputSignal()] ? // value of the default item
        this.removeFilter(this.valueFieldInputSignal()) : // remove the filter
        this.updateFilter({ // add a filter for the field with the value
          field: this.valueFieldInputSignal(),
          operator: 'eq',
          value: value
        })
    ); // update the root filter
  }

  getFilterData(): any {
    this._genericService.getList(this.filterRowTemplateInputSignal().requestDetails, this.filterRowTemplateInputSignal().textAndValueSelector).subscribe(r => {
      this.data = r;
    });
  }
}
