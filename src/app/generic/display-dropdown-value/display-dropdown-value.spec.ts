import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayDropdownValue } from './display-dropdown-value';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of } from 'rxjs';
import { GenericService } from '../../http/generic.service';
import { SettingsService } from '../../http/settings.service';
import { IDetailDropDownTemplate } from '../../stuctures/screens/detail/i-detail-form-settings';

describe('DisplayDropdownValue', () => {
  let component: DisplayDropdownValue;
  let fixture: ComponentFixture<DisplayDropdownValue>;

  const mockDetailDropDownTemplate: IDetailDropDownTemplate =
  {
    templateName: '',
    placeHolderText: '',
    textField: '',
    valueField: '',
    textAndValueSelector: undefined,
    requestDetails: {}
  }

  const mockSettingsService = {
      start: vi.fn(),
      navStart: vi.fn(),
      getSelector: vi.fn(),
      navigateNext: vi.fn()
    };
  const mockGenericService = {
      getItem: vi.fn(),
      getList: vi.fn().mockReturnValue(of(['mocked', 'data', 'here'])),
      deleteItem: vi.fn(),
      updateItem: vi.fn(),
      insertItem: vi.fn()
    };

  const mockSelectedValueField = "value";

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayDropdownValue],
      providers: [
        { provide: SettingsService, useValue: mockSettingsService },
        { provide: GenericService, useValue: mockGenericService },
        provideAnimationsAsync()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayDropdownValue);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('valueTextTemplateInputSignal', mockDetailDropDownTemplate);
    fixture.componentRef.setInput('selectedValueInputSignal', mockSelectedValueField);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
