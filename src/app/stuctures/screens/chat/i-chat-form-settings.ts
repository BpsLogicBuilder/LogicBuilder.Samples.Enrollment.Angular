export interface IChatFormSettings {
    title: string;
    agentConfigurationIdentifier: string;
    chatHeight: number;
    chatWidth: number;
    signalRConnection: ISignalRConnection;
}

export interface ISignalRConnection {
    agentHubUrl: string;
    receiveAgentErrorHandler: string;
    receiveAgentMessageHandler: string;
    receiveAgentResponseCompleteHandler: string;
    sendMessageToAgentHubMethodName: string;
    sessionInitializedHandler: string;
}