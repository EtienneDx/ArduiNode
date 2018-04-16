/* @flow */
import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import '../css/App.css';

type Props = {
  data : string,
  shown : boolean,
  toggleShown : Function,
}

class OutputBox extends Component<Props> {

  render() {
    if(this.props.shown === false) return null;
    return (
      <div className="OutputBox">
        <button onClick={() => this.props.toggleShown()}>Close</button>
        <CopyToClipboard text={this.props.data}><button>Copy</button></CopyToClipboard>
        <pre id="code">{this.props.data}</pre>
      </div>
    );
  }
}

export default OutputBox;
