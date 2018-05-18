// @flow
import React, { Component } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
//import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/css/bootstrap-theme.css';

import './App.css';
import TopBar from '../../views/common/TopBar';
import Auth from '../../common/Auth';
import Home from '../Home';
import Signin from '../../views/Auth/Signin';
import Register from '../../views/Auth/Register';
import Listen from '../Listen';
import Collaborate from '../Collaborate';


type Props = {};

type State = {};

export default class App extends Component<Props, State> {
  state = {};

  auth: Auth;

  constructor() {
    super();

    // Create the Auth service
    this.auth = new Auth();
  }

  getHome() {
    return (props: any) => <Home {...props}
      auth={this.auth}
    />;
  }

  getSignin() {
    return (props: any) => <Signin {...props}
      auth={this.auth}
    />;
  }

  getRegister() {
    return (props: any) => <Register {...props}
      auth={this.auth}
    />;
  }

  getListen() {
    return (props: any) => <Listen {...props}
      auth={this.auth}
    />;
  }

  getCollaborate() {
    return (props: any) => <Collaborate {...props}
      auth={this.auth}
    />;
  }

  render() {
    var root = '/';

    // Auth temporarily removed
    // if(this.auth.isAuth()) {
    //   root = '/listen';
    // }
    // <Route path="/auth/signin" name="Signin" component={this.getSignin()}/>
    // <Route path="/auth/register" name="Register" component={this.getRegister()}/>

    return (
      <div className="App">
        <TopBar {...this.props} auth={this.auth} />
        <Switch>
          <Route path="/listen" name="Listen" component={this.getListen()}/>
          <Route path="/collaborate" name="Collaborate" render={() => (
            <Collaborate {...this.props} auth={this.auth} />
          )}/>
          <Route path="/" name="Home" component={this.getHome()}/>
          <Redirect from="/" to={root}/>
        </Switch>
        <div id="fixed-bg"></div>
      </div>
    );
  }
}
