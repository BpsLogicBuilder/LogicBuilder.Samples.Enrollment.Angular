import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenericDetail } from './generic-detail';
import { IDetailFormSettings } from '../../stuctures/screens/detail/i-detail-form-settings';
import { of } from 'rxjs';
import { ICommandButton } from '../../stuctures/i-command-button';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { GenericService } from '../../http/generic.service';
import { UiNotificationService } from '../../common/ui-notification.service';

describe('GenericDetail', () => {
  let component: GenericDetail;
  let fixture: ComponentFixture<GenericDetail>;

  const mockSettings: IDetailFormSettings = {
    title: '',
    displayField: '',
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
      imports: [GenericDetail],
      providers: [
        { provide: GenericService, useValue: mockGenericService },
        { provide: UiNotificationService, useValue: mockUiNotificationServicer },
        provideAnimationsAsync()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GenericDetail);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('settingsInputSignal', mockSettings);
    fixture.componentRef.setInput('commandButtonsInputSignal', mockCommandButtons);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
