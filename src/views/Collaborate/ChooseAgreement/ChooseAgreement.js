// @flow

import * as React from 'react';
import CollaboratePage from '../CollaboratePage';
import './agreement.css';
import { FormattedMessage } from 'react-intl';
import { Col, Row } from 'react-bootstrap';
import Agreement from './Agreement';

type AgreementProps = {
  chooseAgreement: Function,
  current: string,
  autoFocusEl?: HTMLElement
};

class ChooseAgreement extends React.Component<AgreementProps> {
  render() {
    const { chooseAgreement, current } = this.props;

    return (
      <CollaboratePage prev="upload" submit={this.props.submit} title="title:agreement">
        <Agreement id="0" tabIndex="2" chooseAgreement={chooseAgreement} current={current} autoFocus />
        <Agreement id="1" tabIndex="3   " chooseAgreement={chooseAgreement} current={current} />
      </CollaboratePage>
    );
  }
}

export default ChooseAgreement;

