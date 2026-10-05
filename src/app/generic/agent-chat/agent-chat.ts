import { Component, afterNextRender, effect, ElementRef, ViewChild, input, OnInit, inject, AfterViewInit, OnDestroy, Injector, runInInjectionContext } from '@angular/core';
import { KENDO_CONVERSATIONALUI } from '@progress/kendo-angular-conversational-ui';
import { MarkdownComponent } from 'ngx-markdown';
import { SignalR } from '../../http/signal-r'; 
import { IChatFormSettings } from '../../stuctures/screens/chat/i-chat-form-settings';
import { ICommandButton } from '../../stuctures/i-command-button';
import { ViewTypeEnum } from '../../stuctures/screens/i-view-type';
import { UiNotificationService } from '../../common/ui-notification.service';


@Component({
  imports: [KENDO_CONVERSATIONALUI, MarkdownComponent],
  selector: 'app-agent-chat',
  styleUrl: './agent-chat.css',
  templateUrl: './agent-chat.html',
  providers: [SignalR]
})
export class AgentChat implements OnInit, AfterViewInit, OnDestroy {
  private isUserAtBottom = true;
  private scrollListener?: () => void;

  @ViewChild('chatContainer', { read: ElementRef }) chatElement!: ElementRef;

  public settingsInputSignal = input.required<IChatFormSettings>();
  public commandButtonsInputSignal = input.required<ICommandButton[]>();

  private readonly injector = inject(Injector);
  protected signalRService = inject(SignalR);
  private readonly _uiNotificationService = inject(UiNotificationService);

  constructor(){
    effect(() => {
      // 1. Read the signal value to register the dependency
      this.signalRService.messageHistory(); 
      
      // 2. Schedule the scroll right after Angular renders the new DOM elements
      if (this.isUserAtBottom) {
        // 2. Re-open the injection context so afterNextRender can safely run
        runInInjectionContext(this.injector, () => {
          afterNextRender(() => {
            this.scrollToBottom();
          });
        });
      }
    });
  }


  ngOnInit(): void {
    this.signalRService.startConnection(this.settingsInputSignal().signalRConnection);
  }

  ngAfterViewInit(): void {
    const messageListE = this.chatElement?.nativeElement.querySelector('.k-message-list');
    
    if (messageListE) {
      // Create the listener function
      this.scrollListener = () => {
        const threshold = 50; // Pixels from the bottom to consider "at the bottom"
        const position = messageListE.scrollHeight - messageListE.scrollTop - messageListE.clientHeight;
        
        // If position is close to 0, they are at the bottom
        this.isUserAtBottom = position <= threshold;
      };

      messageListE.addEventListener('scroll', this.scrollListener);
    }
  }

  ngOnDestroy(): void {
    // Clean up native event listener to prevent memory leaks
    const messageListE = this.chatElement?.nativeElement.querySelector('.k-message-list');
    if (messageListE && this.scrollListener) {
      messageListE.removeEventListener('scroll', this.scrollListener);
    }
  }

  private scrollToBottom(): void {
    if (!this.chatElement) return;

    // Kendo Chat renders a container with the class '.k-message-list'
    const messageListEl = this.chatElement.nativeElement.querySelector('.k-message-list');

    if (messageListEl) {
      messageListEl.scrollTo({
        top: messageListEl.scrollHeight,
        behavior: 'smooth' // Enforces the smooth animation
      });
    }
  }

  navigateNext(button: ICommandButton)
  {
    this._uiNotificationService.navigateNext({
      viewType: ViewTypeEnum.Chat,
      commandButtonRequest: { newSelection: button.shortString, cancel: button.cancel || false }
    });
  }

}
