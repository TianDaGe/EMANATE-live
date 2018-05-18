// @flow
import React, { Component } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { LinkContainer } from 'react-router-bootstrap';

import { Col } from 'react-bootstrap';
import './Home.css';


type Props = {

  intl: intlShape
};

type State = {
  muted: boolean
};

class Home extends Component<Props, State> {
  state = {
    muted: true
  };

  videoElem: ?HTMLVideoElement;


  fadeMute(muted: boolean, volume: ?number) {
    if(!this.videoElem) return;

    if(volume === undefined) {
      volume = muted ? 1 : 0;
      this.videoElem.volume = volume;
      if(!muted) this.videoElem.muted = muted;
      setTimeout(() => this.fadeMute(muted, volume), 20);
    } else {
      volume += muted ? -0.1 : 0.1;
      if(volume < 0 || volume > 1) {
        if(muted) this.videoElem.muted = muted;
        return;
      } else {
        this.videoElem.volume = volume;
        setTimeout(() => this.fadeMute(muted, volume), 20);
      }
    }
  }

  toggleMute() {
    const muted = !this.state.muted;

    //this.videoElem.muted = muted;
    setTimeout(() => this.fadeMute(muted), 0);

    this.setState({
      muted
    });
  }

  render() {
    return (
      <section className="Home animated fadeIn clearfix">
        <Col xs={10} xsOffset={1} sm={5} smOffset={1} className="half-screen">
          <article>
            <h1>Collaborate</h1>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s.</p>
            <LinkContainer to="/collaborate"><span className="btn">Create</span></LinkContainer>
          </article>
        </Col>
        <Col xs={10} xsOffset={1} sm={5} smOffset={0} className="half-screen">
          <article>
            <h1>Listen</h1>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s.</p>
            <LinkContainer to="/listen"><span className="btn">Play</span></LinkContainer>
          </article>
        </Col>
      </section>
    );
  }
}

export default injectIntl(Home);
