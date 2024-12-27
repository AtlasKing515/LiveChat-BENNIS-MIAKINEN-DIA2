import React, { useState } from 'react';

import Icon from '../../components/Icon/Icon';
import './Overlay.css';

interface Props {
    onSubmit: (value: string) => void;
}

export default function Overlay({ onSubmit }: Props) {

    var [value, setValue] = useState('');

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        if (value.length > 30) {
            return;
        }
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if(value.length < 1 || value.length > 36) {
                return;
            }
            onSubmit(value);
        }
    }

    return(
        <div className="overlay-container">
            <div className="overlay-content">
                <h4 className="overlay-title">Welcome to the chat</h4>
                <div className="overlay-textfield">
                    <input className="overlay-input-content" type="text" onKeyDown={onKeyDown} onChange={onChange} placeholder='Type your name' minLength={3} maxLength={30}/>
                    <button className="overlay-submit-btn" onClick={() => onSubmit(value)}>
                        <Icon name="arrow_forward" />
                    </button>
                </div>
            </div>
        </div>
    )
}