// @flow
import React, { Component } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { LinkContainer } from 'react-router-bootstrap';

import { Col } from 'react-bootstrap';
import './Home.css';

type Props = {};
type State = {};

class Home extends Component<Props, State> {
  render() {
    return (
      <section className="Home animated fadeIn clearfix">
        <Col xs={12} sm={6} className="half-screen">
          <Col xs={10} xsOffset={1}>
            <article>
              <h1>Collaborate</h1>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s.</p>
              <LinkContainer to="/collaborate"><span className="btn">Create</span></LinkContainer>
            </article>
          </Col>
        </Col>
        <Col xs={12} sm={6} className="half-screen">
          <Col xs={10} xsOffset={1}>
            <article>
              <h1>Listen</h1>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s.</p>
              <LinkContainer to="/listen"><span className="btn">Play</span></LinkContainer>
            </article>
          </Col>
        </Col>
      </section>
    );
  }
}

export default injectIntl(Home);
