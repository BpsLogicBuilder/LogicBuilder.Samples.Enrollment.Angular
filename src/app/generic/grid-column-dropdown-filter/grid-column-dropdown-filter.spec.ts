import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterService } from '@progress/kendo-angular-grid';
import { GenericService } from '../../http/generic.service';
import { GridColumnDropdownFilter } from './grid-column-dropdown-filter';
import { Subject, of } from 'rxjs';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('GridColumnDropdownFilter', () => {
  let component: GridColumnDropdownFilter;
  let fixture: ComponentFixture<GridColumnDropdownFilter>;

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
  const mockFilterRowTemplate = {};
  const mockTextField = "field";
  const mockValueField = "value";

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridColumnDropdownFilter],
      providers: [
        { provide: FilterService, useValue: mockFilterService },
        { provide: GenericService, useValue: mockGenericService },
        provideAnimationsAsync()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GridColumnDropdownFilter);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('filterRowTemplateInputSignal', mockFilterRowTemplate);
    fixture.componentRef.setInput('textFieldInputSignal', mockTextField);
    fixture.componentRef.setInput('valueFieldInputSignal', mockValueField);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
