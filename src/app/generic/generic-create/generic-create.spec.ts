import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenericCreate } from './generic-create';
import { of } from 'rxjs';
import { ICommandButton } from '../../stuctures/i-command-button';
import { abstractControlKind, IEditFormSettings, IInputFieldControlSettings } from '../../stuctures/screens/edit/i-edit-form-settings';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { GenericService } from '../../http/generic.service';
import { DateService } from '../../common/date.service';
import { ListManagerService } from '../../common/list-manager.service';
import { UntypedFormBuilder } from '@angular/forms';
import { UiNotificationService } from '../../common/ui-notification.service';

describe('GenericCreate', () => {
  let component: GenericCreate;
  let fixture: ComponentFixture<GenericCreate>;
  let setting: IInputFieldControlSettings = {
    textTemplate: {
      templateName: 'Name'
    },
    abstractControlType: abstractControlKind.inputFieldControl,
    field: 'name',
    domElementId: 'name',
    title: 'name',
    type: 'boolean',
    placeholder: 'name',
    fieldSettings: [],
    requestDetails: { getUrl: '/test', modelType: 'Test' },
    conditionalDirectives: {}
  }
  const mockSettings: IEditFormSettings = {
    title: 'Courses',
    displayField: 'Courses',
    requestDetails: {},
    formGroupTemplate: {
      templateName: 'template'
    },
    fieldSettings: [
      setting
    ]
  };
  
  const mockCommandButtons: ICommandButton[] = [];

  const mockGenericService = {
      getItem: vi.fn().mockReturnValue(of({})),
      getList: vi.fn().mockReturnValue(of([])),
      deleteItem: vi.fn(),
      updateItem: vi.fn(),
      insertItem: vi.fn()
    };
  const mockDateService = {
      convertToDate: vi.fn(),
    };
  const mockFormBuilder = new UntypedFormBuilder();
  const mockUiNotificationServicer = {
    start: vi.fn(),
    navStart: vi.fn(),
    navigateNext: vi.fn()
  };
  const mockListManagerService = {
    updateFormEntityState: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericCreate],
      providers: [
        { provide: GenericService, useValue: mockGenericService },
        { provide: DateService, useValue: mockDateService },
        { provide: UntypedFormBuilder, useValue: mockFormBuilder },
        { provide: UiNotificationService, useValue: mockUiNotificationServicer },
        { provide: ListManagerService, useValue: mockListManagerService },
        provideAnimationsAsync()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GenericCreate);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('settingsInputSignal', mockSettings);
    fixture.componentRef.setInput('commandButtonsInputSignal', mockCommandButtons);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
