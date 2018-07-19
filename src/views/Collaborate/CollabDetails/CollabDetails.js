// @flow

import * as React from 'react';
import CollaboratePage from '../CollaboratePage';
import { Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import './collabdetails.css';
import FormField from '../../common/FormField/FormField';
import mn8Api from '../../../common/mn8Api';

type Props = {
  state: State,
  submit: Function,
  mn8Api: mn8Api
};

type State = {
  proposal: {}
};

type Proposal = {

}

class CollabDetails extends React.Component<Props, State> {
  mn8Api: mn8Api;

  constructor(props: Props, state: State) {
    super(props, state);

    this.mn8Api = this.props.mn8Api;

    this.state = {
      proposal: {}
    };

    console.log('const', this.state);
  }

  componentDidMount() {
    const { proposal } = this.props.state;

    console.log('did mount', proposal);

    if (proposal !== undefined && proposal.proposal_name !== undefined) {
      console.log("SET STATE");
      this.setState({ proposal : proposal});
    }

    // Replace this with get collab
    // this.mn8Api.getContracts().then((res) => {
    //   console.log(res);
    //   // this.setState({ collab: res });
    // }).catch(() => {
    //   console.warn("CollabDetails fetch failed");
    // });
  }

  actionProposal(proposal: {}, action: string) {
    console.log(`Action proposal: ${action}`);
    var actionData = {
      partner_user: proposal["requested"] ? proposal["requested"][0].name : "",
      proposer: this.mn8Api.user.id ? this.mn8Api.user.id : "",
      proposal_name: proposal["proposal_name"] ? proposal["proposal_name"] : ""
    };

    return this.mn8Api[action](actionData).then((res) => {
      if (res.success) {
        console.log(`Proposal actioned: ${action}`);
        // TODO : This API function should return the new proposal state, we should not be setting this manually
        this.setState({ proposal : {
          ...this.state.proposal,
          requested: [
            {
              ...this.state.proposal.requested[0],
              accepted: action === 'accept' ? 1 : -1
            }
          ]
        }});
      }
    });
  }

  render() {
    const { proposal } = this.state;

    const status = (() => {
      if (proposal.requested !== undefined) {
        const statusVal = proposal.requested[0].accepted;
        switch (statusVal) {
          case 0:
            return 'pending';
          case 1:
            return 'accepted';
          case -1:
            return 'rejected';
          default:
            return 'pending';
        }
      }
    })();

    const statusClasses = `collab-status ${status}`;

    const CollabDeetsDom = proposal !== undefined && proposal.proposal_name !== undefined ?
      <React.Fragment>
        <Col xs={12} sm={6}>
          <h4>Collab Details</h4>
          <FormField type="text" disabled value="proposal_name"/>
          <FormField type="text" disabled value="price"/>
          <FormField type="text" disabled value="final_filename"/>
          <FormField type="text" disabled value="partner_name"/>
          <FormField type="text" disabled value="partner_percentage"/>
          <FormField type="text" disabled value="collab_filename"/>
        </Col>
        <Col xs={12} sm={6}>
          <h4>Collab Status : <span className={statusClasses}>{status}</span></h4>
          <Col xs={12} sm={6}>
            <button onClick={() => { this.actionProposal(proposal, 'accept') }} className="choice">
              Accept
            </button>
          </Col>
          <Col xs={12} sm={6}>
            <button onClick={() => { this.actionProposal(proposal, 'reject') }} className="choice">
              Reject
            </button>
          </Col>
        </Col>
      </React.Fragment> :
      <React.Fragment>
        <Col xs={12}>
          <h4>Loading...</h4>
        </Col>
      </React.Fragment> ;

    return (
      <CollaboratePage id="CollabDetails" title="title:collabdetails" centeredTitle>
        {CollabDeetsDom}
      </CollaboratePage>
    );
  }
}


export default CollabDetails;