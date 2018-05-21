// @flow

import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';

type Props = {
  prev?: string,
  next?: string,
  children?: React.Node,
  title: string,
  validate?: Function,
  history: PropTypes.object.isRequired,
  submit?: Function,
  centeredTitle?: ?string
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
    const { prev, next, validate, title, centeredTitle, submit } = this.props;

    const titleClasses = centeredTitle ? "collaborate_heading center" : "collaborate_heading",
          titleDom = title ?
      <FormattedMessage
        id={title}>
        {(message) => <h2 className={titleClasses}>{message}</h2>}
      </FormattedMessage> :
      null;

    // Test for previous page defined, render button if so
    const prevDom = prev ?
      <FormattedMessage
        id={`menu:${prev}`}>
        {(message) => <Link to={prev} tabIndex="1" className="btn btn-radius navigation">{message}</Link>}
      </FormattedMessage> :
      null;

    // Test for next page defined & if a validate function exists for the current page
    const nextNav = next ?
      <FormattedMessage
        id={`menu:${next}`}>
          {(message) => validate !== undefined ?
            <a onClick={validate} tabIndex="11" className="btn btn-radius navigation">{message}</a> :
            <Link to={next} tabIndex="11" className="btn btn-radius navigation">{message}</Link> }
      </FormattedMessage> :
      null;

    const submitDom = submit ?
      <FormattedMessage
        id={`menu:submit`}>
          {(message) => <a onClick={submit} tabIndex="11" className="btn btn-radius navigation">{message}</a> }
      </FormattedMessage> :
      null;

    const nextDom = nextNav || submitDom;

    return (
      <Grid className="collaborate_wrapper">
        <Col xs={12} md={10} mdOffset={1} className="collaborate_page">
          <Row>
            <Col className="collaborate_content" xs={12}>
              {titleDom}
              {this.props.children}
            </Col>
          </Row>
          <Row>
            <Col className="collaborate_navigation left" xs={6}>
              {prevDom}
            </Col>
            <Col className="collaborate_navigation right" xs={6}>
              {nextDom}
            </Col>
          </Row>
        </Col>
      </Grid>
    );
  }
}

export default withRouter(CollaboratePage);

