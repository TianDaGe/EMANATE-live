// @flow

import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';

type Props = {
  prev?: string,
  next?: string,
  center?: string,
  children?: React.Node,
  title: string,
  validate?: Function,
  history: PropTypes.object.isRequired,
  submit?: Function,
  centeredTitle?: ?string,
  id?: ?string
};

type State = {
  redirect: boolean
}

class CollaboratePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this._handleKeyDown = this._handleKeyDown.bind(this);
  }

  componentWillMount(){
    // Add keydown listener
    document.addEventListener("keydown", this._handleKeyDown);
  }

  componentWillUnmount() {
    // Destroy keydown listener
    document.removeEventListener("keydown", this._handleKeyDown);
  }

  /**
   * Handle key down Event
   */
  _handleKeyDown = (event: KeyboardEvent) => {
    const { keyCode } = event,
        ENTER = 13;


    // Currently only listening for ENTER, which will click available anchor elements
    switch(keyCode) {
      case ENTER:
        this.testAnchor(event);
        break;
      default:
        break;
    }
  }

  /**
   * Test for anchor element, simulate click
   */
  testAnchor = (event: KeyboardEvent) => {
    const srcEl = event.srcElement,
          isNavAnchor = srcEl !== undefined && srcEl.classList.contains('navigation') || srcEl.classList.contains('clickable');

    return isNavAnchor && srcEl.click();
  }

  /**
   * Goto next page (via validation if it exists)
   */
  nextPage() {
    const { next, validate } = this.props;

    // Run validation (next page routing handled by validation function)
    if (validate !== undefined) {
      return validate();
    }

    // No validation, go to next page
    if (next) {
      this.props.history.push(next);
    }
  }

  render() {
    const { prev, next, center, validate, title, centeredTitle, submit, id, url } = this.props;

    const titleClasses = centeredTitle ? "collaborate_heading center" : "collaborate_heading",
          titleDom = title ?
      <FormattedMessage
        id={title}>
        {(message) => <h2 className={titleClasses}>{message}</h2>}
      </FormattedMessage> :
      null;

    // Test for previous page defined, render button if so
    const prevDom = prev ?
      <Col className="collaborate_navigation left" xs={6}>
        <FormattedMessage
          id={`menu:${prev}`}>
          {(message) => <Link to={prev} tabIndex="1" className="btn btn-radius btn-inline navigation">{message}</Link>}
        </FormattedMessage>
      </Col> : null;

    // Test for next page defined & if a validate function exists for the current page
    const nextNav = next ?
      <Col className="collaborate_navigation right" xs={6}>
        <FormattedMessage
          id={`menu:${next}`}>
            {(message) => validate !== undefined ?
              <a onClick={validate} tabIndex="11" className="btn btn-radius btn-inline navigation">{message}</a> :
              <Link to={next} tabIndex="11" className="btn btn-radius btn-inline navigation">{message}</Link> }
        </FormattedMessage>
      </Col> : null;

    const submitDom = submit ?
      <Col className="collaborate_navigation right" xs={6}>
        <FormattedMessage
          id={`menu:submit`}>
            {(message) => <a onClick={submit} tabIndex="11" className="btn btn-radius btn-inline navigation">{message}</a> }
        </FormattedMessage>
      </Col> : null;

    const centeredDom = center ?
      <Col className="collaborate_navigation" xs={6} xsOffset={3}>
        <FormattedMessage
          id={`menu:${center}`}>
            {(message) => validate !== undefined ?
              <a onClick={validate} tabIndex="11" className="btn btn-radius btn-inline navigation">{message}</a> :
              <Link to={url} tabIndex="11" className="btn btn-radius btn-inline navigation">{message}</Link> }
        </FormattedMessage>
      </Col> : null;

    const nextDom = nextNav || submitDom;

    return (
      <Grid id={id} className="collaborate_wrapper">
        <Col xs={12} md={10} mdOffset={1} className="collaborate_page">
          <Row>
            <Col className="collaborate_content" xs={12}>
              {titleDom}
              <Row>
                {this.props.children}
              </Row>
            </Col>
          </Row>
        </Col>
        <Col xs={12} md={10} mdOffset={1}>
          <Row>
            {centeredDom}
            {prevDom}
            {nextDom}
          </Row>
        </Col>
      </Grid>
    );
  }
}

export default withRouter(CollaboratePage);

