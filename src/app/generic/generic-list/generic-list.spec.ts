import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenericList } from './generic-list';
import { GenericService } from '../../http/generic.service';
import { UiNotificationService } from '../../common/ui-notification.service';
import { IListFormSettings } from '../../stuctures/screens/list/i-list-form-settings';
import { ICommandButton } from '../../stuctures/i-command-button';
import { of } from 'rxjs';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('GenericList', () => {
  let component: GenericList;
  let fixture: ComponentFixture<GenericList>;

  const mockSettings: IListFormSettings = {
    title: 'Courses',
    fieldsSelector: undefined,
    requestDetails: {}
  };
    
  const mockCommandButtons: ICommandButton[] = [];

  const mockGenericService = {
    getItem: vi.fn().mockReturnValue(of({})),
    getList: vi.fn().mockReturnValue(of([])),
    deleteItem: vi.fn(),
    updateItem: vi.fn(),
    insertItem: vi.fn()
  };

  const mockUiNotificationServicer = {
    start: vi.fn(),
    navStart: vi.fn(),
    navigateNext: vi.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericList],
      providers: [
        { provide: GenericService, useValue: mockGenericService },
        { provide: UiNotificationService, useValue: mockUiNotificationServicer },
        provideAnimationsAsync()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GenericList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('settingsInputSignal', mockSettings);
    fixture.componentRef.setInput('commandButtonsInputSignal', mockCommandButtons);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
