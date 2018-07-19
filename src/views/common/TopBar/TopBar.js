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
  activeKey: string,
  authenticated: boolean
};

class TopBar extends Component<Props, State> {
  state = {
    navExpanded: false,
    activeKey: this.props.location.pathname,
    authenticated: this.props.auth.isAuth()
  };

  constructor(props: Props) {
    super(props);

    this.setNavExpanded = this.setNavExpanded.bind(this);
    this.closeNav = this.closeNav.bind(this);
    this.handleSelect = this.handleSelect.bind(this);

    this.auth = this.props.auth;
    this.mn8Api = this.props.mn8Api;

    console.log('auth', this.state.authenticated);
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

  handleLogin = () => {
    this.auth.authenticate('user11', 'user11')
      .then(() => {
        this.setState({ authenticated: true });
      });
  }

  handleLogout = () => {
    this.auth.logout();
    this.setState({ authenticated: false });
  }

  render() {
    const loggedin = true;

    const user = loggedin ? (
      <React.Fragment>
        <span className="user-avatar"></span>
        <a>Logout</a>
      </React.Fragment>
    ) : (
      <a onClick={this.handleLogin.bind(this)} className="btn btn-radius btn-inline navigation">Authorise</a>
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

    // Toast container
    // <ToastContainer
    //   position="top-right"
    //   type="default"
    //   autoClose={3000}
    //   hideProgressBar={true}
    //   newestOnTop={false}
    //   closeOnClick
    //   pauseOnHover
    // />

    return (
      <ColComp className={this.state.activeKey}>
        <Row>
          <div id="navbar-logo">
            <LinkContainer to="/">
              <img src="./img/emanate-logo.svg" alt="Emanate" id="topbar-logo" />
            </LinkContainer>
          </div>
          <Col id="navbar-user" xsHidden>
            {user}
          </Col>
        </Row>
      </ColComp>
    );
  }
}

export default injectIntl(TopBar);
