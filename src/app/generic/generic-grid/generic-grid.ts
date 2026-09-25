import { Component, OnInit, ViewChild, inject, input, signal, TemplateRef } from '@angular/core';
import { DataStateChangeEvent, FilterService, GridComponent, ColumnComponent, GroupHeaderTemplateDirective, CellTemplateDirective, FilterCellTemplateDirective, FilterMenuTemplateDirective, GroupFooterTemplateDirective, FooterTemplateDirective, CommandColumnComponent, DetailTemplateDirective } from '@progress/kendo-angular-grid';
import { DataSourceRequestState, CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { GridService } from '../../http/grid.service';
import { IGridSettings, IColumnSettings } from '../../stuctures/screens/grid/i-grid-settings';
import { ICommandButton } from '../../stuctures/i-command-button';
import { IGridResult } from '../../stuctures/screens/grid/i-grid-result';
import { ObjectHelper } from '../../common/object-helper';
import { IGridRequest } from '../../stuctures/screens/requests/i-requests-base';
import { ViewTypeEnum } from '../../stuctures/screens/i-view-type';
import { UiNotificationService } from '../../common/ui-notification.service';
import { EntityType } from '../../stuctures/screens/i-base-model';
import { NgTemplateOutlet, CurrencyPipe, DatePipe } from '@angular/common';
import { GridColumnDropdownFilter } from '../grid-column-dropdown-filter/grid-column-dropdown-filter';
import { GridColumnMultiselectFilter } from '../grid-column-multiselect-filter/grid-column-multiselect-filter';

@Component({
  imports: [GridComponent, ColumnComponent, GroupHeaderTemplateDirective, NgTemplateOutlet, CellTemplateDirective, FilterCellTemplateDirective, FilterMenuTemplateDirective, GroupFooterTemplateDirective, FooterTemplateDirective, CommandColumnComponent, DetailTemplateDirective, GridColumnDropdownFilter, GridColumnMultiselectFilter, CurrencyPipe, DatePipe],
  selector: 'app-generic-grid',
  styleUrl: './generic-grid.css',
  templateUrl: './generic-grid.html',
})
export class GenericGrid implements OnInit {
  @ViewChild('gridCellTemplate_Date', { static: true }) gridCellTemplate_Date!: TemplateRef<any>;
  @ViewChild('gridCellTemplate_Currency', { static: true }) gridCellTemplate_Currency!: TemplateRef<any>;
  @ViewChild('groupHeaderTemplate', { static: true }) groupHeaderTemplate!: TemplateRef<any>;
  @ViewChild('groupHeaderTemplate_Date', { static: true }) groupHeaderTemplate_Date!: TemplateRef<any>;
  @ViewChild('groupHeaderTemplate_Currency', { static: true }) groupHeaderTemplate_Currency!: TemplateRef<any>;
  @ViewChild('groupFooterTemplate', { static: true }) groupFooterTemplate!: TemplateRef<any>;
  @ViewChild('groupFooterTemplate_Date', { static: true }) groupFooterTemplate_Date!: TemplateRef<any>;
  @ViewChild('groupFooterTemplate_Currency', { static: true }) groupFooterTemplate_Currency!: TemplateRef<any>;
  @ViewChild('gridFooterTemplate', { static: true }) gridFooterTemplate!: TemplateRef<any>;
  @ViewChild('gridFooterTemplate_Date', { static: true }) gridFooterTemplate_Date!: TemplateRef<any>;
  @ViewChild('gridFooterTemplate_Currency', { static: true }) gridFooterTemplate_Currency!: TemplateRef<any>;
  @ViewChild('itemListTemplate', { static: true }) itemListTemplate!: TemplateRef<any>;
  @ViewChild('filterRowTemplateDropDown', { static: true }) filterRowTemplateDropDown!: TemplateRef<any>;
  @ViewChild('filterMenuTemplateMultiSelect', { static: true }) filterMenuTemplateMultiSelect!: TemplateRef<any>;

  public settingsInputSignal = input.required<IGridSettings>(); 
  public commandButtonsInputSignal = input.required<ICommandButton[]>();
  public filterValueSourceItemInputSignal = input<any>({});

  private readonly _uiNotificationService = inject(UiNotificationService);
  private readonly _gridService = inject(GridService);

  public gridButtons?: ICommandButton[];
  public items = signal<IGridResult | null>(null); 
  public aggregateResult = signal<any>(null); 
  public state: DataSourceRequestState = {};


  public getTemplate(templateName: string) : TemplateRef<any> {
    const templateMap: Record<string, TemplateRef<any>> = {
      'gridCellTemplate_Date': this.gridCellTemplate_Date,
      'gridCellTemplate_Currency': this.gridCellTemplate_Currency,
      'groupHeaderTemplate': this.groupHeaderTemplate,
      'groupHeaderTemplate_Date': this.groupHeaderTemplate_Date,
      'groupHeaderTemplate_Currency': this.groupHeaderTemplate_Currency,
      'groupFooterTemplate': this.groupFooterTemplate,
      'groupFooterTemplate_Date': this.groupFooterTemplate_Date,
      'groupFooterTemplate_Currency': this.groupFooterTemplate_Currency,
      'gridFooterTemplate': this.gridFooterTemplate,
      'gridFooterTemplate_Date': this.gridFooterTemplate_Date,
      'gridFooterTemplate_Currency': this.gridFooterTemplate_Currency,
      'itemListTemplate': this.itemListTemplate,
      'filterRowTemplateDropDown': this.filterRowTemplateDropDown,
      'filterMenuTemplateMultiSelect': this.filterMenuTemplateMultiSelect,
    };

    return templateMap[templateName];
  }

  public getCellContext(dataItem: any, columnSetting: IColumnSettings) {
    return {
      $implicit: dataItem,
      field: columnSetting.field
    }
  }

  public getRowFilterContext(filter: CompositeFilterDescriptor, columnSetting: IColumnSettings) {
    return {
      $implicit: filter,
      isPrimitive: columnSetting.filterRowTemplate?.isPrimitive,
      field: columnSetting.field,
      filterRowTemplate: columnSetting.filterRowTemplate,
      textField: columnSetting.filterRowTemplate?.textField,
      valueField: columnSetting.filterRowTemplate?.valueField
    }
  }

  public getMenuFilterContext(filter: CompositeFilterDescriptor, columnSetting: IColumnSettings, filterService: FilterService) {
    return {
      $implicit: filter,
      filterService: filterService,
      isPrimitive: columnSetting.filterMenuTemplate?.isPrimitive,
      field: columnSetting.field,
      filterMenuTemplate: columnSetting.filterMenuTemplate,
      textField: columnSetting.filterMenuTemplate?.textField,
      valueField: columnSetting.filterMenuTemplate?.valueField
    }
  }

  public getListContext(dataItem: any, columnSetting: IColumnSettings) {
    return {
      $implicit: dataItem,
      field: columnSetting.field,
      displayMember: columnSetting.cellListTemplate?.displayMember
    }
  }

  public getGroupFooterContext(groupAggregates: any, columnSetting: IColumnSettings) {
    return {
      field: columnSetting.field,
      columnTitle: columnSetting.title,
      aggregates: columnSetting.groupFooterTemplate?.aggregates,
      groupAggregates: groupAggregates
    }
  }

  public getGroupHeaderContext(groupAggregates: any, columnSetting: IColumnSettings) {
    return {
      field: columnSetting.field,
      columnTitle: columnSetting.title,
      aggregates: columnSetting.groupHeaderTemplate?.aggregates,
      groupAggregates: groupAggregates.aggregates
    }
  }

  public getGridFooterContext(gridAggregateResult: any, columnSetting: IColumnSettings) {
    return {
      field: columnSetting.field,
      columnTitle: columnSetting.title,
      aggregates: columnSetting.groupFooterTemplate?.aggregates,
      gridAggregateResult: gridAggregateResult
    }
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    if (state?.group) {
      state.group.forEach(group => group.aggregates = this.settingsInputSignal()?.aggregates);
    }

    this.state = state;
    this.state.aggregates = this.settingsInputSignal().aggregates;

    this.updateGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    console.log("Filter Changed: " + filter.logic);
  }

  ngOnInit() {
    const gridSettings = this.settingsInputSignal();
    this.gridButtons = this.commandButtonsInputSignal().filter(btn => btn.gridCommandButton === true);
    this.state = {
      skip: gridSettings.state ? gridSettings.state.skip : undefined,
      take: gridSettings.state ? gridSettings.state.take : undefined,
      filter: gridSettings.state?.filterGroup
        ? ObjectHelper.getCompositeFilter(gridSettings.state.filterGroup, this.filterValueSourceItemInputSignal())
        : undefined,
      group: this.settingsInputSignal().state?.group
        ? ObjectHelper.getGroupDescriptors(this.settingsInputSignal().state?.group || [])
        : undefined,
      aggregates: gridSettings.aggregates
    }

    this.updateGrid();
  }

  updateGrid(): void {
    this._gridService.fetch(this.state || {}, this.settingsInputSignal()?.requestDetails || {}).subscribe(r => {
      this.items.set(r); 
      this.aggregateResult.set(r.aggregateResult);
    });
  }

  gridCommandClick(item: EntityType, button: ICommandButton) {
    this.doPost({
      entity: item,
      viewType: ViewTypeEnum.Grid,
      commandButtonRequest: { newSelection: button.shortString, cancel: button.cancel || false }
    });
  }

  formCommandClick(button: ICommandButton) {
    this._uiNotificationService.navigateNext({
      viewType: ViewTypeEnum.Grid,
      commandButtonRequest: { newSelection: button.shortString, cancel: button.cancel || false }
    });
  }

  doPost(request: IGridRequest): void {
    this._uiNotificationService.navigateNext(request);
  }
}
