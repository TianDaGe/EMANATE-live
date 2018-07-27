// @flow

import * as React from 'react';
import CollaboratePage from '../CollaboratePage';
import { Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import './collabdetails.css';
import FormField from '../../common/FormField/FormField';
import mn8Api from '../../../common/mn8Api';
import _ from 'lodash';

type Props = {
  state: State,
  submit: Function,
  mn8Api: mn8Api
};

type State = {
  proposal: {}
};

type Proposal = {
  proposal_name: string,
  price: number,
  filename: string,
  requested: Array
}

class CollabDetails extends React.Component<Props, State> {
  mn8Api: mn8Api;
  proposal: Proposal;

  constructor(props: Props, state: State) {
    super(props, state);

    this.mn8Api = this.props.mn8Api;

    this.state = {
      proposal: {}
    };
  }

  componentDidMount() {
    const { proposal } = this.props.state;

    // Proposal exists
    if (proposal !== undefined && proposal.name !== undefined) {
      this.setProposal(proposal);
    } else {
      const { hash } = this.props.match.params,
            decodedHash = atob(hash),
            parsedObj = typeof decodedHash === 'string' ? JSON.parse(decodedHash) : decodedHash;

      // Proposal doesn't exist (deep link/page refresh), fetch contract
      if (parsedObj && parsedObj.user !== undefined) {
          this.mn8Api.getContract({ user: parsedObj.user, contract: parsedObj.contract })
            .then((res) => {
              if (res.data) {
                this.setProposal(res.data);
                return res.data;
              }
            });
      }
    }
  }

  setProposal(proposal: {}) {
    this.setState({ proposal : proposal});
  }

  cancelProposal(proposal: {}) {
    var cancelData = {
      partner_user: proposal["approvals"] ? proposal["approvals"][0].name : "",
      proposer: this.mn8Api.user.id ? this.mn8Api.user.id : "",
      proposal_name: proposal["proposal"] ? proposal["name"] : ""
    };

    return this.mn8Api.cancel(cancelData).then((res) => {
      if (res.success) {
        console.log(`Proposal cacelled.`);
        // TODO : This API function should return the new proposal state, we should not be setting this manually
        this.setState({ proposal : res.data });
      }
    });
  }

  actionProposal(proposal: {}, action: string) {
    console.log(`Action proposal: ${action}`);
    var actionData = {
      partner_user: proposal["approvals"] ? proposal["approvals"][0].name : "",
      proposer: this.mn8Api.user.id ? this.mn8Api.user.id : "",
      proposal_name: proposal["name"] ? proposal["name"] : ""
    };

    console.log('action data', actionData);

    return this.mn8Api[action](actionData).then((res) => {
      console.log("ACTION PROP", res);
      if (res.success) {
        console.log(`Proposal actioned: ${action}`);
        this.setState({ proposal : res.data });
      }
    });
  }

  render() {
    const { proposal } = this.state;

    // const proposal = {
    //   proposal_name: 'propName',
    //   requested: [
    //     {
    //       accepted: 0
    //     }
    //   ]
    // };

    const status = (() => {
      if (proposal.approvals !== undefined) {
        const statusVal = proposal.approvals[0].accepted;
        switch (statusVal) {
          case 0:
            return 'pending';
          case 1:
            return 'accepted';
          case -1:
            return 'rejected';
          case -2:
            return 'cancelled';
          default:
            return 'pending';
        }
      }
    })();

    const statusClasses = `collab-status ${status}`,
          actionClasses = status !== 'pending' ? 'disabled choice' : 'choice';

    // Accept/Reject button
    const ActionDom = ({action}) => (
     status !== 'pending' ?
       <button className={actionClasses}>
         {action}
       </button>
     : <button onClick={() => { this.actionProposal(proposal, action) }} className={actionClasses}>
         {action}
       </button>
    );

    const CollabDeetsDom = proposal !== undefined && proposal.name !== undefined ?
      <React.Fragment>
        <Col xs={12} sm={6}>
          <h4>Collab Details</h4>
          <FormField type="text" disabled placeholder="proposal_name" value={proposal.name}/>
          <FormField type="text" disabled placeholder="price" value={proposal.price}/>
          <FormField type="text" disabled placeholder="final_filename" value={proposal.filename}/>
          <FormField type="text" disabled placeholder="partner_name" value={proposal.approvals[0].name}/>
          <FormField type="text" disabled placeholder="partner_percentage" value={proposal.approvals[0].percentage}/>
          <FormField type="text" disabled placeholder="collab_filename" value={proposal.approvals[0].filename}/>
        </Col>
        <Col xs={12} sm={6}>
          <h4>Collab Status: <span className={statusClasses}>{status}</span></h4>
          <div className="nopad-child-cols two-cold-middle-pad">
            <Col xs={12} sm={6}>
              <ActionDom action='accept' />
            </Col>
            <Col xs={12} sm={6}>
              <ActionDom action='reject' />
            </Col>
          </div>
          <Col xs={12} className="nopad">
            <button onClick={() => { this.cancelProposal(proposal) }} className="choice cancel">
              Cancel Collaboration
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