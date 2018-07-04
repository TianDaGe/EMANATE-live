// @flow
import React, { Component } from 'react';
import { Redirect, Switch, Route, withRouter } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import SoundEngine from 'sound-engine';

import './Test.css';
import Auth from '../../common/Auth';
import Blockchain from '../../common/Blockchain';
import Ipfs from '../../common/Ipfs';
import Playlist from '../../common/Playlist/';
import mn8Api from '../../common/mn8Api';

import _ from 'lodash';
import { uniqueIdGenerator, tabindexGenerator, generateId } from '../../common/utils';
// import FormField from './FormField/FormField';
import { BlockConsoleControl } from '../common/BlockConsole/BlockConsole';
import TopBar from '../common/TopBar';
import FormField from '../common/FormField/FormField';

type Props = {
  auth: {},
  blockconsole: BlockConsoleControl
};

// User type declaration
export type Recipient = {
  id: number,
  name: string,
  email: string,
  owner: boolean
};

// State type declaration
export type State = {
    authenticate: {
        username: string,
        password: string
    },
    user: {
      id: string,
      token: string
    },
    propose: {
      proposal_name: string,
      price: number,
      final_filename: string,
      partner_name: string,
      partner_percentage: number,
      collab_filename: string
    },
    cancel: {
      proposer: string,
      proposal_name: string
    },
    accept: {
      proposer: string,
      proposal_name: string
    },
    reject: {
      proposer: string,
      proposal_name: string
    },
    pay: {
      proposer: string,
      proposal_name: string,
      seconds: number
    },
    addAsset: {
      title: string,
      artist_name: string
    },
    removeAsset: {
      title: string
    },
    listen: {
      title: string
    }
};

class Test extends Component<Props, State> {
  recipientIdGen = new uniqueIdGenerator('recipient');
  tabindexing = new tabindexGenerator();

  proposal_name = generateId('prop', 4);
  track_title = generateId('title', 4);

  state: State = {
      authenticate: {
          username: 'user11',
          password: 'user11'
      },
      user: {
        id: '',
        token: ''
      },
      propose: {
        proposal_name: this.proposal_name,
        price: 10000,
        final_filename: generateId('finalfile', 4),
        partner_name: 'user12',
        partner_percentage: 50,
        collab_filename: generateId('collabname', 4)
      },
      cancel: {
        proposer: 'user11',
        proposal_name: this.proposal_name
      },
      accept: {
        proposer: 'user11',
        proposal_name: this.proposal_name
      },
      reject: {
        proposer: 'user11',
        proposal_name: this.proposal_name
      },
      pay: {
        proposer: 'user11',
        proposal_name: this.proposal_name,
        seconds: 10
      },
      addAsset: {
        title: this.track_title,
        artist_name: generateId('artist', 4)
      },
      removeAsset: {
        title: this.track_title
      },
      listen: {
        title: this.track_title
      }
  };

  bc: Blockchain;
  ipfs: Ipfs;
  soundengine: SoundEngine;
  playlist: Playlist;
  blockconsole: BlockConsoleControl;
  mn8Api: mn8Api;

  constructor(props: Props) {
    super(props);

    // Create the Blockchain service
    this.bc = new Blockchain(props.auth);

    // Create the Ipfs service
    this.ipfs = new Ipfs();

    // Create the API services
    this.mn8Api = new mn8Api();

    this.blockconsole = props.blockconsole;
  }

  // Component lifecycle hooks

  componentDidMount() {
    console.log('did mount', this.blockconsole);
    this.blockconsole.update("Blockchain connection established.", "green");
  }

  // Handle input (text) change
  handleInputChange(event: SyntheticInputEvent<HTMLInputElement>): mixed {
    const { value, id } = event.target;
    const attr = event.target.name;

    // console.log('hello', this.state[id][attr]);

    this.setState((prev, props) => {
      const newState = _.cloneDeep(prev);
      _.merge(newState[id], {
        [attr]: value
      });
      return newState;
    }, () => {
        console.log('newstate', this.state);
    });
  }

  runApi(event) {
    const { id } = event.target;

    if (this.mn8Api[id] !== undefined) {
      let args = this.state[id] ? this.state[id] : null;

      return this.mn8Api[id](args)
        .then((data) => {
          this.populateResponse(id, data);
      });
    }
  }

  populateResponse(id, response) {
    const blockId = `${id}-response`,
          codeBlock = document.getElementById(blockId);

    if (codeBlock !== null) {
      codeBlock.innerHTML = JSON.stringify(response);
    }
  }

  render() {
    //// <FormField fieldkey="test-user" placeholder="user" id="propose" name="user" onChange={this.handleInputChange.bind(this)} value={this.state.propose.user}/>
    return (
      <React.Fragment>
        <TopBar {...this.props} auth={this.props.auth} area="test" />
        <section className="Test animated fadeIn">
          <div className="main-container-bg row-fluid">

            <h1>Authenticate</h1>
            <Row>
              <Col xs={4}>
                <FormField fieldkey="test-username" placeholder="username" id="authenticate" name="username" onChange={this.handleInputChange.bind(this)} value={this.state.authenticate.username}/>
                <FormField fieldkey="test-password" placeholder="password" id="authenticate" name="password" onChange={this.handleInputChange.bind(this)} value={this.state.authenticate.password}/>
              </Col>
              <Col xs={2}>
                <button id="authenticate" onClick={this.runApi.bind(this)}>Authenticate</button>
              </Col>
              <Col xs={6}>
                <h6>Response:</h6>
                <code id="authenticate-response"></code>
              </Col>
            </Row>

            <h1>Propose</h1>
            <Row>
              <Col xs={4}>
                <FormField fieldkey="test-proposal_name" placeholder="proposal_name" id="propose" name="proposal_name" onChange={this.handleInputChange.bind(this)} value={this.state.propose.proposal_name}/>
                <FormField fieldkey="test-price" placeholder="price" id="propose" name="price" onChange={this.handleInputChange.bind(this)} value={this.state.propose.price}/>
                <FormField fieldkey="test-final_filename" placeholder="final_filename" id="propose" name="final_filename" onChange={this.handleInputChange.bind(this)} value={this.state.propose.final_filename}/>
                <FormField fieldkey="test-partner_name" placeholder="partner_name" id="propose" name="partner_name" onChange={this.handleInputChange.bind(this)} value={this.state.propose.partner_name}/>
                <FormField fieldkey="test-partner_percentage" placeholder="partner_percentage" id="propose" name="partner_percentage" onChange={this.handleInputChange.bind(this)} value={this.state.propose.partner_percentage}/>
                <FormField fieldkey="test-collab_filename" placeholder="collab_filename" id="propose" name="collab_filename" onChange={this.handleInputChange.bind(this)} value={this.state.propose.collab_filename}/>
              </Col>
              <Col xs={2}>
                <button id="propose" onClick={this.runApi.bind(this)}>Propose</button>
              </Col>
              <Col xs={6}>
                Response:
                <code id="propose-response"></code>
              </Col>
            </Row>

            <h1>Accept collab</h1>
            <Row>
              <Col xs={4}>
                <FormField fieldkey="test-price" placeholder="proposer" id="accept" name="proposer" onChange={this.handleInputChange.bind(this)} value={this.state.accept.proposer}/>
                <FormField fieldkey="test-proposal_name" placeholder="proposal_name" id="accept" name="proposal_name" onChange={this.handleInputChange.bind(this)} value={this.state.accept.proposal_name}/>
              </Col>
              <Col xs={2}>
                <button id="accept" onClick={this.runApi.bind(this)}>Accept collab</button>
              </Col>
              <Col xs={6}>
                Response:
                <code id="accept-response"></code>
              </Col>
            </Row>

            <h1>Reject collab</h1>
            <Row>
              <Col xs={4}>
                <FormField fieldkey="test-price" placeholder="proposer" id="reject" name="proposer" onChange={this.handleInputChange.bind(this)} value={this.state.reject.proposer}/>
                <FormField fieldkey="test-proposal_name" placeholder="proposal_name" id="reject" name="proposal_name" onChange={this.handleInputChange.bind(this)} value={this.state.reject.proposal_name}/>
              </Col>
              <Col xs={2}>
                <button id="reject" onClick={this.runApi.bind(this)}>Reject collab</button>
              </Col>
              <Col xs={6}>
                Response:
                <code id="reject-response"></code>
              </Col>
            </Row>

            <h1>Cancel contract</h1>
            <Row>
              <Col xs={4}>
                <FormField fieldkey="test-price" placeholder="proposer" id="cancel" name="proposer" onChange={this.handleInputChange.bind(this)} value={this.state.cancel.proposer}/>
                <FormField fieldkey="test-proposal_name" placeholder="proposal_name" id="cancel" name="proposal_name" onChange={this.handleInputChange.bind(this)} value={this.state.cancel.proposal_name}/>
              </Col>
              <Col xs={2}>
                <button id="cancel" onClick={this.runApi.bind(this)}>Cancel contract</button>
              </Col>
              <Col xs={6}>
                Response:
                <code id="cancel-response"></code>
              </Col>
            </Row>

            <h1>Get contracts</h1>
            <Row>
              <Col xs={4}>
                <span>Get all contracts for current authorised user</span>
              </Col>
              <Col xs={2}>
                <button id="getContracts" onClick={this.runApi.bind(this)}>Get contracts</button>
              </Col>
              <Col xs={6}>
                Response:
                <code id="getContracts-response"></code>
              </Col>
            </Row>

            <h1>Pay</h1>
            <Row>
              <Col xs={4}>
                <FormField fieldkey="test-price" placeholder="proposer" id="pay" name="proposer" onChange={this.handleInputChange.bind(this)} value={this.state.pay.proposer}/>
                <FormField fieldkey="test-proposal_name" placeholder="proposal_name" id="pay" name="proposal_name" onChange={this.handleInputChange.bind(this)} value={this.state.pay.proposal_name}/>
                <FormField fieldkey="test-seconds" placeholder="seconds" id="pay" name="seconds" onChange={this.handleInputChange.bind(this)} value={this.state.pay.seconds}/>
              </Col>
              <Col xs={2}>
                <button id="pay" onClick={this.runApi.bind(this)}>Pay</button>
              </Col>
              <Col xs={6}>
                Response:
                <code id="pay-response"></code>
              </Col>
            </Row>

            <h1>Add asset</h1>
            <Row>
              <Col xs={4}>
                <FormField fieldkey="test-title" placeholder="title" id="addAsset" name="title" onChange={this.handleInputChange.bind(this)} value={this.state.addAsset.title}/>
                <FormField fieldkey="test-artist_name" placeholder="artist_name" id="addAsset" name="artist_name" onChange={this.handleInputChange.bind(this)} value={this.state.addAsset.artist_name}/>
              </Col>
              <Col xs={2}>
                <button id="addAsset" onClick={this.runApi.bind(this)}>Add asset</button>
              </Col>
              <Col xs={6}>
                Response:
                <code id="addAsset-response"></code>
              </Col>
            </Row>

            <h1>Get assets</h1>
            <Row>
              <Col xs={4}>
                <span>Get all assets for current authorised user</span>
              </Col>
              <Col xs={2}>
                <button id="getAssets" onClick={this.runApi.bind(this)}>Get assets</button>
              </Col>
              <Col xs={6}>
                Response:
                <code id="getAssets-response"></code>
              </Col>
            </Row>

            <h1>Remove asset</h1>
            <Row>
              <Col xs={4}>
                <FormField fieldkey="test-title" placeholder="title" id="removeAsset" name="title" onChange={this.handleInputChange.bind(this)} value={this.state.removeAsset.title}/>
              </Col>
              <Col xs={2}>
                <button id="removeAsset" onClick={this.runApi.bind(this)}>Remove asset</button>
              </Col>
              <Col xs={6}>
                Response:
                <code id="removeAsset-response"></code>
              </Col>
            </Row>

            <h1>Get stats</h1>
            <Row>
              <Col xs={4}>
                <span>Get stats for current authorised user</span>
              </Col>
              <Col xs={2}>
                <button id="getStats" onClick={this.runApi.bind(this)}>Get stats</button>
              </Col>
              <Col xs={6}>
                Response:
                <code id="getStats-response"></code>
              </Col>
            </Row>

            <h1>Listen</h1>
            <Row>
              <Col xs={4}>
                <FormField fieldkey="test-title" placeholder="title" id="listen" name="title" onChange={this.handleInputChange.bind(this)} value={this.state.listen.title}/>
              </Col>
              <Col xs={2}>
                <button id="listen" onClick={this.runApi.bind(this)}>Listen</button>
              </Col>
              <Col xs={6}>
                Response:
                <code id="listen-response"></code>
              </Col>
            </Row>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default withRouter(Test);