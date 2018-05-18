// @flow

import React, { Component } from 'react';
import FormField from '../FormField/FormField';
import './recipients.css';
import type { Recipient } from '../Collaborate';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Col } from 'react-bootstrap';

type Props = {
  recipients: [Recipient, Recipient],
  addRecipient: Function,
  removeRecipient: Function,
  inputChange: Function,
  intl: IntlShape,
  errors: Array<any>
};

class Recipients extends Component<Props> {
  render() {
    const { intl, errors, inputChange, addRecipient, removeRecipient, recipients } = this.props;

    /**
     * Owner
     */
    const ownerDom = recipients.map( (recipient) => {
      if (recipient.owner) {
        const { name, email } = recipient,
          nameError = errors[0] !== undefined ? errors[0].name : false,
          emailError = errors[0] !== undefined ? errors[0].email : false;

        return <div className="recipient-container recipient-owner" key={`container-${recipient.id}`}>
          <FormField tabIndex="3" fieldkey={`recipient-name-${recipient.id}`} placeholder={intl.formatMessage({ id: 'recipients_owner_name_placeholder' })} id={recipient.id} name="name" error={nameError.toString()} onChange={inputChange} value={name} owner="true"/>
          <FormField tabIndex="4" fieldkey={`recipient-email-${recipient.id}`} placeholder={intl.formatMessage({ id: 'recipients_owner_email_placeholder' })} id={recipient.id} name="email" error={emailError.toString()} onChange={inputChange} value={email} owner="true"/>
        </div>
      }

      return null;
    });

    /**
     * Recipients
     */
    const recipientsDom = recipients.map( (recipient, index) => {
      if (recipient.owner) {
        return false;
      }

      const { name, email } = recipient,
            closeButton = index > 1 ? <a className="close-button" onClick={removeRecipient} id={recipient.id}>x</a> : null,
            nameError = errors[index] !== undefined ? errors[index].name : false,
            emailError = errors[index] !== undefined ? errors[index].email : false,
            tabindex = 4 + index;

      return <div className="recipient-container recipient-additional" key={`container-${recipient.id}`}>
        {closeButton}
        <FormField tabIndex={tabindex} fieldkey={`recipient-name-${recipient.id}`} placeholder={intl.formatMessage({ id: 'recipients_recipient_name_placeholder' })} id={recipient.id} name="name" key={`name-${recipient.id}`} error={nameError.toString()} onChange={inputChange} value={name} owner="false"/>
        <FormField tabIndex={tabindex} fieldkey={`recipient-email-${recipient.id}`} placeholder={intl.formatMessage({ id: 'recipients_recipient_email_placeholder' })} id={recipient.id} name="email" key={`email-${recipient.id}`} error={emailError.toString()} onChange={inputChange} value={email} owner="false"/>
      </div>
    });

    // <CollaborateInput value="test"/>
    return (
      <Col xs={12} sm={6} className="collaborate_content__block collaborate_recipients">
        <FormattedMessage
          id="recipients_instruction_owner_details">
            {(message) => <h3>{message}</h3>}
        </FormattedMessage>
        <div id="collaborate_owner">
          {ownerDom}
        </div>
        <FormattedMessage
          id="recipients_instruction_recipients_details">
          {(message) => <h3>{message}</h3>}
        </FormattedMessage>
        <div id="collaborate_recipients">
          {recipientsDom}
        </div>
        <FormattedMessage
          id="recipients_add_recipient">
          {(message) => <a className="btn-naked clickable" tabIndex="10" onClick={addRecipient.bind(this)}>{message}</a>}
        </FormattedMessage>
      </Col>
    );
  }
}

export default injectIntl(Recipients);