interface Message {
    channel: string;
    body: string;
}

interface StoredMessage extends Message {
    username: string;
    created_at: Date;
}

export {
    Message,
    StoredMessage,
}