// @flow
import React, { Component } from 'react';
import { Redirect, Switch, Route, withRouter } from 'react-router-dom';
import SoundEngine from 'sound-engine';

import './Collaborate.css';
import Auth from '../../common/Auth';
import Blockchain from '../../common/Blockchain';
import Ipfs from '../../common/Ipfs';
import Playlist from '../../common/Playlist/';
import mn8Api from '../../common/mn8Api';

import _ from 'lodash';
import { uniqueIdGenerator, tabindexGenerator } from '../../common/utils';
import FilesAndRecipients from './FilesAndRecipients/FilesAndRecipients';
import ChooseAgreement from './ChooseAgreement/ChooseAgreement';
import SummaryPage from './SummaryPage/SummaryPage';
import CollabDetails from './CollabDetails/CollabDetails';
import FormField from '../common/FormField/FormField';
import { BlockConsoleControl } from '../common/BlockConsole/BlockConsole';
import TopBar from '../common/TopBar';

type Props = {
  auth: {},
  blockconsole: BlockConsoleControl,
  mn8Api: mn8Api
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
  form: {
    proposal_name: string,
    recipients: [
      Recipient,
      Recipient
    ],
    agreement: number
  },
  proposal: {}
};

class Collaborate extends Component<Props, State> {
  recipientIdGen = new uniqueIdGenerator('recipient');
  tabindexing = new tabindexGenerator();

  state: State = {
    form: {
      proposal_name: '', // proposal_name
      recipients: [{
        id: this.recipientIdGen.next(),
        name: '',
        email: '',
        owner: true
      },{
        id: this.recipientIdGen.next(),
        name: '',
        email: '',
        owner: false
      }],
      agreement: 0
    },
    proposal: {}
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
    this.mn8Api = props.mn8Api;

    this.blockconsole = props.blockconsole;
    this.blockconsole.update("Blockchain connection established.", "green");
  }

  // Add recipient
  addRecipient(e: Event) {
    e.preventDefault();

    let newRecipient = {
      id: this.recipientIdGen.next(),
      name: '',
      email: '',
      owner: false,
      errors: {
        name: false,
        email: false
      }
    };

    this.setState((prev, props) => {
      let newState = _.cloneDeep(prev);
      newState.form.recipients.push(newRecipient);
      return newState;
    });
  }

  // Remove recipient
  removeRecipient(event: Event) {
    const { currentTarget } = event;

    if (event && currentTarget instanceof HTMLElement && currentTarget.id) {
      const currentId = currentTarget.id;
      this.setState((prev, props) => {
        let newState = _.cloneDeep(prev),
            recipIndex = _.findIndex(newState.form.recipients, (recip) => { return recip.id === currentId });

        // Remove recipient
        newState.form.recipients.splice(recipIndex, 1);

        return newState;
      });
    }
  }

  // Handle input (text) change
  handleInputChange(event: SyntheticInputEvent<HTMLInputElement>): mixed {
    const { value, id } = event.target;
    const attr = event.target.name;
    const recipIndex = _.findIndex(this.state.form.recipients, (recip) => { return recip.id === id });

    this.setState((prev, props) => {
      const newState = _.cloneDeep(prev);

      if (id === 'proposal_name') {
        newState.form.proposal_name = value;
      } else {
        _.merge(newState.form.recipients[recipIndex], {
          [attr]: value
        });
      }

      return newState;
    });
  }

  // Handle agreement selection
  handleChooseAgreement(event: Event): void {
    event.preventDefault();

    const selectedAgreement = event && event.currentTarget instanceof HTMLElement && parseInt(event.currentTarget.id, 10);

    if (selectedAgreement !== this.state.form.agreement) {
      this.setState((prev, props) => {
        const newState = _.cloneDeep(prev);
        newState.form.agreement = selectedAgreement;
        return newState;
      });
    }
  }

  // TODO: Write submission function
  submitCollaboration(): void {
    this.blockconsole.update("Submit collaboration proposal.");
    this.mn8Api.propose(this.state.form, true)
      .then( (response) => {
        console.log('res', response);
        if (response && response.success) {
          this.setState({ proposal: response.data });
          this.props.history.push("summary");
        } else {
          console.warn('Proposal Failed, try again.');
        }
      });
  }

  // Render

  getUpload() {
    return (props: any) => <FilesAndRecipients
      recipients={this.state.form.recipients}
      addRecipient={this.addRecipient.bind(this)}
      removeRecipient={this.removeRecipient.bind(this)}
      inputChange={this.handleInputChange}
      tabindexing={this.tabindexing}
    />;
  }

  getAgreement() {
    return (props: any) => <ChooseAgreement
      chooseAgreement={this.handleChooseAgreement.bind(this)}
      current={this.state.form.agreement.toString()}
    />;
  }

  getSummary() {
    return (props: any) => <SummaryPage
      state={this.state}
      submit={this.submitCollaboration.bind(this)}
    />;
  }

  render() {
    return (
      <React.Fragment>
        <TopBar {...this.props} auth={this.props.auth} mn8Api={this.props.mn8Api} area="collaborate" />
        <section className="Collaborate animated fadeIn">
          <Switch>
            <Route path="/collaborate/upload" name="Upload" render={() => (
              <FilesAndRecipients proposal_name={this.state.form.proposal_name}
                                  recipients={this.state.form.recipients}
                                  addRecipient={this.addRecipient.bind(this)}
                                  removeRecipient={this.removeRecipient.bind(this)}
                                  inputChange={this.handleInputChange.bind(this)}
                                  tabindexing={this.tabindexing}/>
            )}/>
            <Route path="/collaborate/agreement" name="Agreement" render={() => (
              <ChooseAgreement
                chooseAgreement={this.handleChooseAgreement.bind(this)}
                current={this.state.form.agreement.toString()}
                submit={this.submitCollaboration.bind(this)}
              />
            )}/>
            <Route path="/collaborate/summary" name="Summary" render={() => (
              <SummaryPage
                state={this.state}
              />
            )}/>
            <Route path="/collaborate/details/:hash" name="Collab" render={({ match }) => (
              <CollabDetails state={this.state} match={match} mn8Api={this.props.mn8Api} />
            )}/>
            <Redirect from="/collaborate" to="/collaborate/upload"/>
          </Switch>
        </section>
      </React.Fragment>
    );
  }
}

export default withRouter(Collaborate);