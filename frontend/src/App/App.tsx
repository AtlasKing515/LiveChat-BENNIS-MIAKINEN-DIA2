import React from 'react';

import SidePanel from './SidePanel/SidePanel';
import ChatContent from './ChatContent/ChatContent';

import './App.css';
import './Fonts.css';


import Client from '../api/client';

import Overlay from './Overlay/Overlay';
import Prompt from './Prompt/Prompt';
import { MessageItem } from 'api/message';
import { Channel, ChannelMessage, ChannelsMap } from 'api/channel';
import StatsContent from './StatsContent/StatsContent';

const client = new Client();

interface State {
  channels: ChannelsMap;
  currentPath: string | null;
  username: string | null;
  promptModal: Array<{ title: string; content: string; onSubmit: (value: string) => void; onCancel: () => void }>;

  statsPage: boolean
}

class App extends React.Component {

  state: State;

  constructor(props: {}) {
    super(props);

    this.state = {
      channels: {},
      currentPath: null,
      username: null,

      promptModal: [],

      statsPage: false
    }

    client.connect();
    client.onMessage((details: ChannelMessage) => {
      this.addMessage(details.channel, details);
    });
  }

  setUsername(username: string) {
    this.setState({
      username: username
    });

    client.setUsername(username);
  }

  addMessage(channelPath: string, message: MessageItem) {
    this.addMessageRange(channelPath, [message]);
  }

  addMessageRange(channelPath: string, message: MessageItem[]) {
    const nextChannel: ChannelsMap = {};

    for (const key in this.state.channels) {
      const channel = this.state.channels[key];

      if (channel.path === channelPath) {
        channel.addMessageRange(message);
      }

      nextChannel[key] = channel;
    }

    this.setState({
      channels: nextChannel
    });
  }

  sendMessage(message: string) {
    if (this.state.username == null) {
      throw new Error('No username defined');
    }

    if (this.state.currentPath == null) {
      throw new Error('No channel selected');
    }

    const channelPath = this.state.currentPath;

    const ms: MessageItem = {
      username: this.state.username,
      body: message,
      created_at: new Date(),
    }

    this.addMessage(channelPath, ms);
    client.sendMessage(channelPath, message);
  }

  async addChannel() {

    try {
      const channelPath = await this.pushPromptModal({
        title: 'New Channel',
        content: 'Type the name of the channel',
      });

      if (!channelPath) return;

      if (this.state.channels[channelPath] != undefined) {
        return;
      }

      client.joinChannel(channelPath);

      client.getMessages(channelPath).then((messages: MessageItem[]) => {
        this.addMessageRange(channelPath, messages);
      });

      this.setState({
        channels: {
          ...this.state.channels,
          [channelPath]: new Channel(channelPath)
        }
      });

      this.changeChannel(channelPath);
    } catch (e) { }
  }

  changeChannel(channelPath: string) {
    this.setState({
      currentPath: channelPath
    });
  }

  closePromptModal(promptItem: PromptModalItem) {
    this.setState({
      promptModal: this.state.promptModal.filter((item) => item !== promptItem)
    });
  }

  pushPromptModal({ title, content }: PromptProps): Promise<string> {
    return new Promise((resolve, reject) => {
      const promptItem: PromptModalItem = {
        title: title,
        content: content,

        onSubmit: (value: string) => {
          this.closePromptModal(promptItem);

          resolve(value);
        },
        onCancel: () => {
          this.closePromptModal(promptItem);

          reject();
        }
      };

      this.setState({
        promptModal: [...this.state.promptModal, promptItem]
      });
    });
  }

  displayStats() {
    this.setState({
      statsPage: !this.state.statsPage
    });

    console.log(this.state.statsPage);
  }

  closeStats() {
    this.setState({
      statsPage: false
    });
  }

  render() {

    if (this.state.username == null) {
      return <Overlay onSubmit={this.setUsername.bind(this)} />;
    }

    const channelContent = this.state.currentPath 
      ? this.state.channels[this.state.currentPath] || null 
      : null;

    return (
      <div className="app-container">
        {this.state.statsPage == true ? 
          (
            <StatsContent onClose={this.closeStats.bind(this)}/>
          ) : (
            <div className="app-content">
              <SidePanel list={this.state.channels} onNewChannel={this.addChannel.bind(this)} onStatsClick={this.displayStats.bind(this)} onChangeChannel={this.changeChannel.bind(this)} />

              <ChatContent channel={channelContent} onSubmit={this.sendMessage.bind(this)} />
            </div>
          )
        }

        {this.state.promptModal.map((modal, index) => {
          return <Prompt key={index} title={modal.title} content={modal.content} onSubmit={modal.onSubmit} onCancel={modal.onCancel} />
        })}
      </div>
    );
  }
}


interface PromptProps {
  title: string,
  content: string,
}

interface PromptModalItem extends PromptProps {
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

export default App;
