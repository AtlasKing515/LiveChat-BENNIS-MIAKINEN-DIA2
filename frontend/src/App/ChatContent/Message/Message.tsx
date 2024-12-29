import { MessageItem } from 'api/message';
import './Message.css';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

function toRelativeDate(now: Date, date: Date) {
    const diff = now.getTime() - date.getTime();

    if(diff < MINUTE) {
        return 'Just now';
    }

    if(diff < HOUR) {
        return `${Math.floor(diff / MINUTE)}m ago`;
    }

    if(diff < DAY) {
        return `${Math.floor(diff / HOUR)}h ago`;
    }

    return `${Math.floor(diff / DAY)}d ago`;
}


interface Props extends MessageItem {
    now: Date;
}

export default function Message({username, body, created_at, now}: Props) {
    

    if(typeof created_at === 'string') {
        created_at = new Date(created_at);
    }

    console.log('Message render', body);
    console.log('Message render', created_at);

    return (<div className="chat-message-item">
        <div className='chat-message-item-header'>
            <div className="chat-message-item-username">
                {username}
            </div>

            <div className="chat-message-item-timestamp">
                {toRelativeDate(now, created_at)}
            </div>
        </div>
        
        <div className="chat-message-item-content">
            <div className="chat-message-item-content-text">
                {body}
            </div>
        </div>
    </div>)
}