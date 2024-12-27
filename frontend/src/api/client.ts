import { io, Socket } from "socket.io-client";
import { MessageItem } from "./message";
import { ChannelMessage } from "./channel";

interface SocketClient extends Socket {}

type OnMessageCallback = (message: ChannelMessage) => void;

class Client {
    socket?: SocketClient;

    constructor() {

    }

    connect() {
        this.socket = io("http://localhost:8080", {
            transports: ['websocket']
        });
    
        this.socket.on("connect", () => {
            if (this.socket) {
                console.log("connected", this.socket.id);
            }
        });
    
        this.socket.on("connect_error", (err) => {
            console.log(err); // true
        });
    }

    setUsername(username: string) {
        if(!this.socket) throw new Error("Socket not connected");

        this.socket.emit("set-username", username);
    }
    
    sendMessage(channelPath: string, content: string) {
        if(!this.socket) throw new Error("Socket not connected");

        this.socket.emit("message", {
            channel: channelPath,
            body: content
        });
    }

    onMessage(callback: OnMessageCallback) {
        if(!this.socket) throw new Error("Socket not connected");

        this.socket.on("message", callback);
    }

    joinChannel(channel: string) {
        if(!this.socket) throw new Error("Socket not connected");

        this.socket.emit("join-channel", channel);
    }

    getMessages(channel: string, page = 0): Promise<MessageItem[]> {
        return new Promise((resolve, reject) => {
            if(!this.socket) throw new Error("Socket not connected");

            this.socket.emit("get-messages", {
                channel: channel,
                page: page
            }, (messages: MessageItem[]) => {
                console.log("loaded from the server", messages);
                resolve(messages);
            });
        });
    }
}


export default Client;