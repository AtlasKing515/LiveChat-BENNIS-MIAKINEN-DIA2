import React from "react";
import "./SidePanel.css";
import Item from "./Item/Item";
import { Channel, ChannelsMap } from "api/channel";


interface Props {
  list: ChannelsMap,
  onChangeChannel: (path: string) => void,
  onNewChannel: () => void,
  onStatsClick: () => void
}

export default class SidePanel extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    onClick(channel: Channel) {
      this.props.onChangeChannel(channel.path);
    }

    newChannel() {
        this.props.onNewChannel();
    }

    onStats() {
      this.props.onStatsClick();
    }

    renderList() {
      var list = []
      // iterate over object list
      for(const key in this.props.list) {
        list.push(
          <Item 
            title={key} 
            onClick={() => this.onClick(this.props.list[key])}
          />
        )
      }

      return list;
    }

    render() {
        return (
          <div className="side-panel-container">
            <div className="side-panel">
                <div className="side-panel-header">
                </div>
                <div className="side-panel-list">
                  {
                    this.renderList()
                  }
                </div>
                
                <Item icon={"add_circle_outline"} title="Join Channel" onClick={this.newChannel.bind(this)}/>
                <Item icon={"assessment"} title="Statistic" onClick={this.onStats.bind(this)}/>
            </div>
          </div>
        );
    }
}