interface Message {
    channel: string;
    body: string;
}

interface StoredMessage extends Message {
    username: string;
    createdAt: Date;
}

export {
    Message,
    StoredMessage,
}