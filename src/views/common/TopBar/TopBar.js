// @flow
import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Col, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import './TopBar.css';
import Auth from '../../../common/Auth';


type Props = {
  auth: Auth,

  location: any,
  history: any,
  intl: intlShape
};

type State = {
  navExpanded: boolean,
  activeKey: string
};

class TopBar extends Component<Props, State> {
  state = {
    navExpanded: false,
    activeKey: this.props.location.pathname
  };

  constructor(props: Props) {
    super(props);

    this.setNavExpanded = this.setNavExpanded.bind(this);
    this.closeNav = this.closeNav.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  setNavExpanded = function(expanded: boolean) {
    this.setState({ navExpanded: expanded });
  }

  closeNav = function() {
    this.setState({ navExpanded: false });
  }

  handleSelect = function(selectedKey) {
    this.props.history.push(selectedKey);
  }

  render() {
    const loggedin = this.props.auth.isAuth();

    const menu = loggedin ? (
      <Nav activeKey={this.state.activeKey} onSelect={this.handleSelect}>
        <NavDropdown title={this.props.intl.formatMessage({id:'menu:listen'})} id="nav-listen">
          <MenuItem eventKey='/listen/tracks'><FormattedMessage id="menu:listen-tracks" /></MenuItem>
          <MenuItem eventKey='/listen/albums'><FormattedMessage id="menu:listen-albums" /></MenuItem>
          <MenuItem eventKey='/listen/shows'><FormattedMessage id="menu:listen-shows" /></MenuItem>
          <MenuItem eventKey='/listen/playlists'><FormattedMessage id="menu:listen-playlists" /></MenuItem>
          <MenuItem divider />
          <MenuItem eventKey='/listen/charts'><FormattedMessage id="menu:listen-charts" /></MenuItem>
        </NavDropdown>
        <NavDropdown title={this.props.intl.formatMessage({id:'menu:discover'})} id="nav-discover">
          <MenuItem eventKey='/discover/beats'><FormattedMessage id="menu:discover-beats" /></MenuItem>
          <MenuItem eventKey='/discover/samples'><FormattedMessage id="menu:discover-samples" /></MenuItem>
          <MenuItem eventKey='/discover/stems'><FormattedMessage id="menu:discover-stems" /></MenuItem>
          <MenuItem divider />
          <MenuItem eventKey='/discover/packs'><FormattedMessage id="menu:discover-packs" /></MenuItem>
        </NavDropdown>
        <NavDropdown title={this.props.intl.formatMessage({id:'menu:collab'})} id="nav-collab">
          <MenuItem eventKey='/collab/my'><FormattedMessage id="menu:collab-my" /></MenuItem>
          <MenuItem divider />
          <MenuItem eventKey='/collab/new'><FormattedMessage id="menu:collab-new" /></MenuItem>
          <MenuItem eventKey='/collab/browse'><FormattedMessage id="menu:collab-browse" /></MenuItem>
          <MenuItem divider />
          <MenuItem eventKey='/collab/contests'><FormattedMessage id="menu:collab-contests" /></MenuItem>
        </NavDropdown>
        <NavItem eventKey='/publish'><FormattedMessage id="menu:publish" /></NavItem>
      </Nav>
    ) : undefined;

    const mn8 = loggedin ? (
      <Nav>
      </Nav>
    ) : undefined;

    const user = loggedin ? (
      <Nav />
    ) : (
      <Nav>
        <LinkContainer to="/auth/signin">
          <NavItem>
            <FormattedMessage id="menu:signin" />
          </NavItem>
        </LinkContainer>
        <NavItem href="http://emanate.live">
          <FormattedMessage id="menu:about" />
        </NavItem>
      </Nav>
    );

    // Decide on TopBar Column layout depending on section
    const ColComp = (props) => {
      let ColDom = this.props.area === 'collaborate' ?
        <Navbar collapseOnSelect onToggle={this.setNavExpanded} expanded={this.state.navExpanded}>
          <Col xs={12} md={10} mdOffset={1} {...props}>
            {props.children}
          </Col>
        </Navbar> :
        <Navbar fluid collapseOnSelect onToggle={this.setNavExpanded} expanded={this.state.navExpanded}>
          <Col xs={12} {...props}>
            {props.children}
          </Col>
        </Navbar> ;

      return (
        <React.Fragment>
          {ColDom}
        </React.Fragment>
      )
    };

    return (
      <ColComp className={this.state.activeKey}>
        <Row>
          <div id="navbar-logo">
            <LinkContainer to="/">
            <img src="./img/emanate-logo.svg" alt="Emanate" id="topbar-logo" />
            </LinkContainer>
          </div>
          <ToastContainer
            position="top-right"
            type="default"
            autoClose={3000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
          />
        </Row>
      </ColComp>
    );
  }
}

export default injectIntl(TopBar);
