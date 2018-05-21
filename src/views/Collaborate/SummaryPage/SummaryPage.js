// @flow

import * as React from 'react';
import CollaboratePage from '../CollaboratePage';
import type { State } from '../Collaborate';
import { Col } from 'react-bootstrap';
import Agreement from '../ChooseAgreement/Agreement';
import { FormattedMessage } from 'react-intl';
import './summary.css';

type Props = {
  state: State,
  submit: Function
};

class SummaryPage extends React.Component<Props> {

  render() {
    const { recipients, agreement } = this.props.state.form,
          recipientsDom = recipients.map((recip, index) => {
            return recip.owner ? <div className="summary_recipient owner" key={index}>
              <h4>{recip.name}</h4>
              <span>{recip.email}</span>
            </div> : <div className="summary_recipient" key={index}>
              <h4>{recip.name}</h4>
              <span>{recip.email}</span>
            </div>
          });

    // <Col xs={12} sm={6}>
    //   <h3>Recipients</h3>
    //   {recipientsDom}
    // </Col>
    // <Col xs={12} sm={6}>
    //   <h3>Agreement</h3>
    //   <Agreement id={agreement} tabIndex="2" />
    // </Col>

    return (
      <CollaboratePage prev="agreement" title="title:summary" submit={this.props.submit} centeredTitle>
        <Col xs={12} sm={6} smOffset={3}>
          <FormattedMessage
            id="lipsum">
              {(message) => <p>{message}</p>}
          </FormattedMessage>
        </Col>
      </CollaboratePage>
    );
  }
}


export default SummaryPage;