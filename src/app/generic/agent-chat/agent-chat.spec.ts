import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentChat } from './agent-chat';
import { IChatFormSettings, ISignalRConnection } from '../../stuctures/screens/chat/i-chat-form-settings';
import { ICommandButton } from '../../stuctures/i-command-button';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { UiNotificationService } from '../../common/ui-notification.service';
import { SignalR } from '../../http/signal-r';
import { Injector } from '@angular/core';

describe('AgentChat', () => {
  let component: AgentChat;
  let fixture: ComponentFixture<AgentChat>;

  const signalRSettings: ISignalRConnection = {
    agentHubUrl: '',
    receiveAgentErrorHandler: '',
    receiveAgentMessageHandler: '',
    receiveAgentResponseCompleteHandler: '',
    sendMessageToAgentHubMethodName: '',
    sessionInitializedHandler: ''
  }

  const mockSettings: IChatFormSettings = {
    title: '',
    agentConfigurationIdentifier: '',
    chatHeight: 0,
    chatWidth: 0,
    signalRConnection: signalRSettings
  }

  const mockCommandButtons: ICommandButton[] = [];

  const mockUiNotificationService = {
    start: vi.fn(),
    navStart: vi.fn(),
    navigateNext: vi.fn()
  };

  const mockSignalRService = {
    user: { id: 1, name: 'You' },
    messageHistory: vi.fn(), 
    startConnection: vi.fn(),
    sendmessage: vi.fn()
  };

  let mockInjector: Partial<Injector>;
  mockInjector = {
      get: vi.fn().mockImplementation((token) => {
        // Return custom mocks depending on the token
        return 'MockedValue';
      }),
    };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AgentChat],
      providers: [
        { provide: Injector, useValue: mockInjector },
        { provide: SignalR, useValue: mockSignalRService },
        { provide: UiNotificationService, useValue: mockUiNotificationService },
        provideAnimationsAsync()
      ]
    });

    TestBed.overrideComponent(AgentChat, {
      set: {
        providers: [
          { provide: SignalR, useValue: mockSignalRService }
        ]
      }
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(AgentChat);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('settingsInputSignal', mockSettings);
    fixture.componentRef.setInput('commandButtonsInputSignal', mockCommandButtons);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
