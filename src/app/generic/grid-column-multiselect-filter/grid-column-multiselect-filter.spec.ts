import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { GenericService } from '../../http/generic.service';
import { GridColumnMultiselectFilter } from './grid-column-multiselect-filter';
import { Subject, of } from 'rxjs';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('GridColumnMultiselectFilter', () => {
  let component: GridColumnMultiselectFilter;
  let fixture: ComponentFixture<GridColumnMultiselectFilter>;

  const mockFilterService = {
    changes: new Subject<any>(),
    filter: vi.fn()
  };

  const mockGenericService = {
      getItem: vi.fn(),
      getList: vi.fn().mockReturnValue(of(['mocked', 'data', 'here'])),
      deleteItem: vi.fn(),
      updateItem: vi.fn(),
      insertItem: vi.fn()
    };

  const mockIsPrimitive = true;
  const mockCurrentFilter: CompositeFilterDescriptor = {
    logic: 'or',
    filters: []
  };
  const mockFilterMenuTemplate = {};
  const mockTextField = "field";
  const mockValueField = "value";
  const mockField = "lastName";

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridColumnMultiselectFilter],
      providers: [
        { provide: GenericService, useValue: mockGenericService },
        provideAnimationsAsync()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GridColumnMultiselectFilter);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isPrimitiveInputSignal', mockIsPrimitive);
    fixture.componentRef.setInput('currentFilterInputSignal', mockCurrentFilter);
    fixture.componentRef.setInput('filterMenuTemplateInputSignal', mockFilterMenuTemplate);
    fixture.componentRef.setInput('textFieldInputSignal', mockTextField);
    fixture.componentRef.setInput('valueFieldInputSignal', mockValueField);
    fixture.componentRef.setInput('filterServiceInputSignal', mockFilterService);
    fixture.componentRef.setInput('fieldInputSignal', mockField);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
