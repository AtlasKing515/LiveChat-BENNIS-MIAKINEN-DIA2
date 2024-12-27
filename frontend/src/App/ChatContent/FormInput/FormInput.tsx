import React, { ChangeEvent } from 'react';

import './FormInput.css';
import Icon from '../../../components/Icon/Icon';

interface Props {
    onSubmit: (message: string) => void
}

interface State {
    message: string
}

export default class Input extends React.Component<Props> {
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            message: ''
        };
    }

    onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if(event.key === 'Enter') {
            this.onSubmit();
        }
    }
    
    onChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            message: event.target.value
        });
    }

    onSubmit() {
        if(this.state.message.trim() !== '') {
            this.props.onSubmit(this.state.message);
        }

        this.setState({
            message: ''
        });
    }

    render() {
        return (
          <div className="chat-form-input-container">
            <input type="text" className="chat-form-input" placeholder={"Saisir le message..."} value={this.state.message} onChange={this.onChange.bind(this)} onKeyDown={this.onKeyDown.bind(this)}/>
            <button className="chat-form-submit-btn" onClick={this.onSubmit.bind(this)}>
                <Icon name={"arrow_upward"} />
            </button>
          </div>
        );
    }
}