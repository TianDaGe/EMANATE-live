// @flow

import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import './formfield.css';

type Props = {
  placeholder: string,
  id: number,
  name: string,
  onChange: Function,
  owner: string,
  error?: string,
  intl: IntlShape,
  fieldkey: string
};

class FormField extends Component<Props> {
  render() {
    const { error, name, intl, owner, fieldkey } = this.props,
          erronous = error !== undefined && error === 'true',
          classes = erronous ? "collaborate__form_field error" : "collaborate__form_field",
          errorKey = owner === 'true' ? `errors.owner-${name}` : `errors.recipient-${name}`,
          errorDom = erronous ? intl.formatMessage({ id: errorKey }) : null;

    return (
      <div className="collaborate__form_field_container">
        <input key={fieldkey} className={classes} {...this.props}/>
        <span className="error">{errorDom}</span>
      </div>
    );
  }
}

export default injectIntl(FormField);