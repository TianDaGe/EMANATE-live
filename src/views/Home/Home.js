// @flow
import React, { Component } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { LinkContainer } from 'react-router-bootstrap';
import TopBar from '../common/TopBar';

import { Col } from 'react-bootstrap';
import './Home.css';

type Props = {};
type State = {};

class Home extends Component<Props, State> {
  render() {
    return (
      <React.Fragment>
        <TopBar {...this.props} auth={this.props.auth} area="collaborate" />
        <section className="Home animated fadeIn clearfix">
          <Col xs={12} sm={6} className="half-screen">
            <article>
              <img src="./img/levels-ico.svg"/>
              <h1>Collaborate</h1>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s.</p>
              <LinkContainer to="/collaborate"><span className="btn btn-centered">Create</span></LinkContainer>
            </article>
          </Col>
          <Col xs={12} sm={6} className="half-screen">
            <article>
              <img src="./img/wave-ico.svg"/>
              <h1>Listen</h1>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s.</p>
              <LinkContainer to="/listen"><span className="btn btn-centered">Play</span></LinkContainer>
            </article>
          </Col>
        </section>
      </React.Fragment>
    );
  }
}

export default injectIntl(Home);
