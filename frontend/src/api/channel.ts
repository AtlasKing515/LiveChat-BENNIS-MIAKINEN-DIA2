import { MessageItem } from "./message";
// Channel
class Channel {

    path: string;
    messages: MessageItem[] = [];
    
    constructor(path: string) {
        this.path = path;
        this.messages = [];
    }

    addMessage(message: MessageItem) {
        this.messages.push(message);
    }

    addMessageRange(messages: MessageItem[]) {
        this.messages.push(...messages);
    }
}

interface ChannelMessage extends MessageItem {
    channel: string;
}

type ChannelsMap = { [key: string]: Channel }

export {
    Channel,
    ChannelMessage,
    type ChannelsMap
};