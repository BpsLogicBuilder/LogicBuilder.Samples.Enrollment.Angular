import { Service, inject, signal, WritableSignal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { User, Message, SendMessageEvent } from '@progress/kendo-angular-conversational-ui';
import { ISignalRConnection } from '../stuctures/screens/chat/i-chat-form-settings';
import { UrlsService } from './urls.service';

@Service({ autoProvided: false })
export class SignalR {
  private readonly _urls = inject(UrlsService);
  private hubConnection!: signalR.HubConnection;

  private currentThreadId = "";
  private messageCount: number = 0;

  public user: User = { id: 1, name: 'You' };
  public bot: User = { id: 0, name: 'AI Assistant' };
  public messageHistory: WritableSignal<Message[]> = signal([]);

   public startConnection(signalRSettings: ISignalRConnection): void {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(new URL(signalRSettings.agentHubUrl, this._urls.chatHubUrl).href, {
                // Optional configuration (e.g., skip negotiation if using pure WebSockets)
                skipNegotiation: false, 
                transport: signalR.HttpTransportType.WebSockets
            })
        .withAutomaticReconnect() // Automatically reconnects if the connection drops
        .configureLogging(signalR.LogLevel.Information)
        .build();

        this.hubConnection
        .start()
        .then(() => console.log('SignalR connection established.'))
        .catch(err => console.error('Error while starting SignalR connection: ', err));

        // 3. Register real-time event listeners
        this.registerOnStreamingEvents(signalRSettings.receiveAgentMessageHandler, signalRSettings.receiveAgentResponseCompleteHandler);
        this.registerOnServerError(signalRSettings.receiveAgentErrorHandler);
        this.registerSessionInitialized(signalRSettings.sessionInitializedHandler);
    }

    private registerOnStreamingEvents(receiveAgentMessageHandler: string, receiveAgentResponseCompleteHandler: string) {
        // Listens for a method named "ReceiveAgentChunk" triggered by the .NET backend
        this.hubConnection.on(receiveAgentMessageHandler, (threadId: string, chunk: string) => {
        this.messageHistory.update(prev => {
            const history = [...prev];
            const lastItem = history.at(-1);

            console.log(chunk);
            // Scenario A: The typing indicator is active (this is the very first text chunk)
            if (lastItem?.typing) {
            history[history.length - 1] = {
                id: this.messageCount++,
                author: this.bot,
                text: chunk, 
                timestamp: new Date()
            };
            return history;
            }

            // Scenario B: The text container is already built, append the new chunk to it
            if (lastItem && lastItem.author.id === this.bot.id) {
            history[history.length - 1] = {
                ...lastItem,
                text: (lastItem.text || '') + chunk
            };
            return history;
            }

            return history;
        });

        this.hubConnection.on(receiveAgentResponseCompleteHandler, (threadId: string) => {
            this.currentThreadId = threadId;
            console.log(`Stream complete for thread: ${threadId}`);
            // If your Kendo setup requires any adjustments on finish, perform them here
        });
        });
    }

    private registerOnServerError(receiveAgentErrorHandler: string) {
        // Listens for a method named "ReceiveAgentError" triggered by the .NET backend
        this.hubConnection.on(receiveAgentErrorHandler, (threadId: string, message: string) => {
        console.error(`Error on thread ${threadId}: ${message}`);

        // Clear the typing bubble if an execution crash happens
        this.messageHistory.update(prev => {
            const lastItem = prev.at(-1);
            if (lastItem?.typing) {
            return prev.slice(0, -1);
            }
            return prev;
        });
        });
    }

    private registerSessionInitialized(sessionInitializedHandler: string) {
        this.hubConnection.on(sessionInitializedHandler, (threadId: string) => {
        this.currentThreadId = threadId;
        console.log('Initialized Thread: ' + threadId);
        });
    }

    public sendMessage(e: SendMessageEvent, chatHubMessageHandler: string): void {
        const item: Message = { id: this.messageCount++, author: this.user, text: e.message.text, timestamp: new Date() };
        this.messageHistory.update(prev => [...prev, item]);
        
        //chatHubMessageHandler is the message handler in the SignalR hub
        //e.g. public async Task SendMessageToAgent(string? threadId, string userMessage, string agentIdentifier)
        this.hubConnection.invoke(chatHubMessageHandler, this.currentThreadId, e.message.text, 'contoso-only')
        .catch(err => console.error('Error while invoking SendMessage: ', err));

        const typingIndicatorPlaceholder: Message = {
        id: this.messageCount, 
        author: this.bot,
        typing: true, // This flag signals Kendo to render the animated loading dots
        timestamp: new Date()
        };
        
        this.messageHistory.update(prev => [...prev, typingIndicatorPlaceholder]);
    }
}
