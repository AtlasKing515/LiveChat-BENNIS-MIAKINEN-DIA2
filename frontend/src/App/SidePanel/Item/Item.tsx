import Icon from '../../../components/Icon/Icon';
import './Item.css';

interface Props {
  title: string,
  onClick: () => void,
  icon?: string
}

export default function Item({title, onClick, icon} : Props) {
    return (
      <div className={"chat-channel-item-list "  + ((!icon) ? "regular" : "")} onClick={onClick}>
        {icon != undefined && 
          <span className="chat-channel-item-list-icon">
            <Icon name={icon}/>
          </span>
        }
        <span className="chat-channel-item-list-title">{title}</span>
      </div>
    );
}