import React, { useEffect } from 'react';


import './WelcomeContent.css';
import Icon from 'components/Icon/Icon';

export default function ChatContent() {
  return (
    <div className="welcome-content-container">
      <div className="welcome-content">
        <h1>Welcome to ChatApp</h1>
        <p className="details">
            Click on 
            <span className="add-icon"><Icon name="add"/> </span>
            to add a new channel
        </p>
      </div>
    </div>
  );
}