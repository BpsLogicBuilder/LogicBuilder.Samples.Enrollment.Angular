import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldMultiselect } from './form-field-multiselect';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { GenericService } from '../../http/generic.service';
import { of } from 'rxjs';

describe('FormFieldMultiselect', () => {
  let component: FormFieldMultiselect;
  let fixture: ComponentFixture<FormFieldMultiselect>;

  const mockGenericService = {
    getItem: vi.fn(),
    getList: vi.fn().mockReturnValue(of(['mocked', 'data', 'here'])),
    deleteItem: vi.fn(),
    updateItem: vi.fn(),
    insertItem: vi.fn()
  };
  const mockTextField = "field";
  const mockValueField = "value";
  const mockMultiSelectTemplate = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldMultiselect],
      providers: [
        { provide: GenericService, useValue: mockGenericService },
        provideAnimationsAsync()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldMultiselect);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('multiSelectTemplateInputSignal', mockMultiSelectTemplate);
    fixture.componentRef.setInput('textFieldInputSignal', mockTextField);
    fixture.componentRef.setInput('valueFieldInputSignal', mockValueField);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
