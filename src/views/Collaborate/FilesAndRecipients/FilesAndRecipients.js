// @flow

import * as React from 'react';
import CollaboratePage from '../CollaboratePage';
import Upload from '../Upload/Upload';
import Recipients from '../Recipients/Recipients';
import type { Recipient } from '../Collaborate';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { required, email } from '../Validation/validations';
import { Col } from 'react-bootstrap';

type FilesAndRecipientsProps = {
  recipients: [Recipient, Recipient],
  addRecipient: Function,
  removeRecipient: Function,
  inputChange: Function,
  history: PropTypes.object.isRequired
};

type State = {
  errors: Array<any>
}

class FilesAndRecipients extends React.Component<FilesAndRecipientsProps, State> {
  constructor(props: FilesAndRecipientsProps, state: State) {
      super();

      this.state = {
        errors: []
      };
  }

  validate = () => {
    const { recipients } = this.props;
    let isValid = true,
        errors = [];

    // Loop recipients, test name & email
    _.forEach(recipients, (recip, index) => {
      const nameError = required(recip.name),
            emailError = email(recip.email);

      errors[index] = {
        name: nameError,
        email: emailError
      }

      if (nameError || emailError) {
        isValid = false;
      }
    });

    this.setState({errors: errors});

    // Component is valid, onwards!
    if (isValid) {
      this.props.history.push("agreement");
    }
  };

  render() {
    return (
      <CollaboratePage next="agreement" title="title:start" validate={this.validate.bind(this)}>
        <Upload />
        <Recipients {...this.props} errors={this.state.errors} />
      </CollaboratePage>
    );
  }
}

export default withRouter(FilesAndRecipients);

