import * as React from 'react';
import CollaboratePage from '../CollaboratePage';
import './agreement.css';
import { FormattedMessage } from 'react-intl';
import { Col } from 'react-bootstrap';

type Props = {
  id: string,
  current: string,
  chooseAgreement: Function,
  defaultChecked?: ?boolean,
  autoFocus?: ?boolean,
  tabIndex: string
};

class Agreement extends React.Component<Props> {
  autoFocusEl = null;

  componentDidMount(){
    if (this.autoFocusEl) {
      this.autoFocusEl.focus();
    }
  }

  render() {
    const { id, current } = this.props,
          staticVersion = current === undefined,
          classes = !staticVersion && id === current.toString() ? "current collaborate_agreement" : "collaborate_agreement";

    const agreementDom = staticVersion ?
      <Col xs={12} className={classes}>
         <FormattedMessage
           id={`agreement_title_${id}`}>
             {(message) => <h3>{message}</h3>}
         </FormattedMessage>
         <FormattedMessage
           id={`agreement_content_${id}`}>
             {(message) => <p>{message}</p>}
         </FormattedMessage>
      </Col> :
      <Col xs={12} className={classes}>
        <a className="clickable"
         onClick={this.props.chooseAgreement}
         id={this.props.id}
         tabIndex={this.props.tabIndex}
         ref={(anchor) => { if (this.props.autoFocus) { this.autoFocusEl = anchor }}}>
           <FormattedMessage
             id={`agreement_title_${id}`}>
               {(message) => <h3>{message}</h3>}
           </FormattedMessage>
           <FormattedMessage
             id={`agreement_content_${id}`}>
               {(message) => <p>{message}</p>}
           </FormattedMessage>
        </a>
      </Col>;

    return (
      <React.Fragment>
        {agreementDom}
      </React.Fragment>
    );
  }
}

export default Agreement;