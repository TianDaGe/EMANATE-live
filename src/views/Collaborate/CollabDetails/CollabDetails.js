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
  submit: Function
};

type State = {
  collab: {
    success: Boolean,
    data: {}
  }
};

class CollabDetails extends React.Component<Props, State> {
  mn8Api: mn8Api;

  constructor(props: Props, state: State) {
    super(props);

    this.mn8Api = new mn8Api();

    this.state = {
      collab: {
        success: false,
        data: {}
      }
    };
  }

  componentDidMount() {

    // Replace this with get collab
    this.mn8Api.authenticate({
      username: 'user11',
      password: 'user11'
    }).then((res) => {
      this.setState({ collab: res });
    }).catch(() => {
      console.warn("CollabDetails fetch failed");
    });
  }


  render() {
    console.log('match', this.props);

    const CollabDeetsDom = this.state.collab.success ?
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
          <h4>Collab Status : <span className="collab-status pending">Pending</span></h4>
          <Col xs={12} sm={6}>
            <button className="choice">
              Accept
            </button>
          </Col>
          <Col xs={12} sm={6}>
            <button className="choice">
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