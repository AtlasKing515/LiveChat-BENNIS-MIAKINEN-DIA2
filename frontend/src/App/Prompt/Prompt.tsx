import React, { useState } from 'react';
import Icon from '../../components/Icon/Icon';

import './Prompt.css';

import Button from '../../components/Button/Button';
import TextField from '../../components/TextField/TextField';

interface Props {
    title: string;
    content: string;
    onSubmit: (value: string) => void;
    onCancel: () => void;
}

export default function Prompt({ title, content, onSubmit, onCancel }: Props) {

    var [value, setValue] = useState('');

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        if (value.length > 30) {
            return;
        }
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (value.length < 1 || value.length > 36) {
                return;
            }
            onSubmit(value);
        }
    }

    return (
        <div className="prompt-container">
            <div className="prompt">
                <div className="prompt-content">
                    <h2 className="prompt-title">{title}</h2>
                    <TextField value={value} onChange={onChange} onKeyDown={onKeyDown} placeholder={content} minLength={1} maxLength={36} autofocus/>


                    <div className="prompt-footer">
                        <Button fill onClick={() => onSubmit(value)}>Submit</Button>
                        <Button onClick={() => onCancel()}>Cancel</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}