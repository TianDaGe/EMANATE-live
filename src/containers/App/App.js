// @flow
import React, { Component } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';

import mn8Api from '../../common/mn8Api';

import './App.css';
import { BlockConsoleControl, BlockConsole } from '../../views/common/BlockConsole/BlockConsole';
import Auth from '../../common/Auth';
import Scatter from '../../common/Scatter';

import TopBar from '../../views/common/TopBar';
import Home from '../../views/Home';
import Signin from '../../views/Auth/Signin';
import Register from '../../views/Auth/Register';
import Listen from '../../views/Listen';
import Collaborate from '../../views/Collaborate';
import Test from '../../views/Test';


type Props = {};

type State = {};

export default class App extends Component<Props, State> {
  state = {};

  auth: Auth;

  constructor(props: Props, state: State) {
    super();

    // Create the Auth service
    this.mn8Api = new mn8Api();
    this.auth = new Auth(this.mn8Api);

    // Initiate Scatter
    this.scatter = new Scatter();

    this.blockconsole = new BlockConsoleControl();
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

    //<BlockConsole control={this.blockconsole}/>

    return (
      <div className="App">
        <Switch>
          <Route path="/listen" name="Listen" render={() => (
            <Listen {...this.props} auth={this.auth} blockconsole={this.blockconsole} mn8Api={this.mn8Api} scatter={this.scatter} />
          )}/>
          <Route path="/collaborate" name="Collaborate" render={() => (
            <Collaborate {...this.props} auth={this.auth} blockconsole={this.blockconsole} mn8Api={this.mn8Api} scatter={this.scatter} />
          )}/>
          <Route path="/test" name="Collaborate" render={() => (
            <Test {...this.props} auth={this.auth} blockconsole={this.blockconsole} mn8Api={this.mn8Api} scatter={this.scatter} />
          )}/>
          <Route path="/" name="Home" render={() => (
            <Home {...this.props} auth={this.auth} blockconsole={this.blockconsole} scatter={this.scatter} />
          )}/>
          <Redirect from="/" to={root}/>
        </Switch>
        <BlockConsole control={this.blockconsole}/>
        <div id="fixed-bg"></div>
      </div>
    );
  }
}
