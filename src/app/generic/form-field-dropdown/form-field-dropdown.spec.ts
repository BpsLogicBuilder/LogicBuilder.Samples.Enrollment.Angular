import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldDropdown } from './form-field-dropdown';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of } from 'rxjs';
import { GenericService } from '../../http/generic.service';
import { SettingsService } from '../../http/settings.service';

describe('FormFieldDropdown', () => {
  let component: FormFieldDropdown;
  let fixture: ComponentFixture<FormFieldDropdown>;

  const mockDropDownTemplate = {
      templateName: "string",
      placeHolderText: "string",
      textField: "string",
      valueField: "string",
      textAndValueSelector: {},
      requestDetails: {}
  };
  const mockTextField = "field";
  const mockValueField = "value";

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldDropdown],
      providers: [
        { provide: SettingsService, useValue: mockSettingsService },
        { provide: GenericService, useValue: mockGenericService },
        provideAnimationsAsync()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldDropdown);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('dropDownTemplateInputSignal', mockDropDownTemplate);
    fixture.componentRef.setInput('textFieldInputSignal', mockTextField);
    fixture.componentRef.setInput('valueFieldInputSignal', mockValueField);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
