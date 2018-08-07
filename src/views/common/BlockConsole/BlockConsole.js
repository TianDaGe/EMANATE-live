import React, { Component } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import _ from 'lodash';
import { Observer } from 'tools';
import { colorMap } from '../../../common/utils'

import './BlockConsole.css';

export class BlockConsoleControl extends Observer {
  constructor() {
    super();

    this.lines = [{ text: 'Intialising...', color: 'white'}];
    this.update = this.updateConsole.bind(this);

    this.hidden = true;
    this.showHide = this.showHide.bind(this);
  }

  showHide() {
    this.hidden = !this.hidden;
    this.fireEvent('showHide', this.hidden);
  }

  updateConsole(line, color) {
    this.lines.push({
      text: line,
      color: colorMap(color)
    });
    this.fireEvent('update', this.lines);
  }
}


type Props = {
  control: BlockConsoleControl
};

type State = {
  lines: {},
  hidden: Boolean
};

export class BlockConsole extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.control = props.control;
    this.state = {
      lines: this.control.lines,
      hidden: this.control.hidden
    };

    this.control.on('update', (lines) => {
      this.setState({lines: lines}, () => {
        this.scrollToBottom();
      });
    })

    this.control.on('showHide', (hidden) => {
      this.setState({hidden: hidden});
      this.scrollToBottom();
    })

    this.toggleConsole = () => {
      var toggleState = !this.state.hidden;
      this.setState({hidden: toggleState});
    };

    this.scrollToBottom = () => {
      this.endOfConsole.scrollIntoView({ behavior: "smooth" });
    }
  }

  render() {
    const { lines } = this.state,
      linesDom = lines.map((line, index) => {
        return <span key={`line-${index}`} className="console-line" style={{color: line.color}}>&nbsp;>&nbsp;{line.text}</span>
      }),
      classList = this.state.hidden ? 'BlockConsole minimised' : 'BlockConsole',
      toggleDom = this.state.hidden ? '⇧' : 'x';

    return (
      <div className={classList}>
        <span className="blockconsole-toggle" onClick={this.control.showHide}>{toggleDom}</span>
        <div className="scroll-container">
          <span className="blue">Emanate Prototype BlockConsole</span>
          <div className="lines-container">
            {linesDom}
          </div>
          <div className="end-of-console" ref={(el) => { this.endOfConsole = el; }}></div>
        </div>
      </div>
    );
  }
}