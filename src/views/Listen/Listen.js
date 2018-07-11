// @flow
import React, { Component } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import SoundEngine from 'sound-engine';

import './Listen.css';
import Auth from '../../common/Auth';
import Blockchain from '../../common/Blockchain';
import Ipfs from '../../common/Ipfs';
import Playlist from '../../common/Playlist/';
import FooterPlayer from './FooterPlayer';
import TrackBrowser from './TrackBrowser';
import CoverBrowser from './CoverBrowser';
import TopBar from '../common/TopBar';
import { BlockConsoleControl } from '../common/BlockConsole/BlockConsole';


type Props = {
  auth: Auth,
  blockconsole: BlockConsoleControl
};

type State = {};

export default class Listen extends Component<Props, State> {
  state: State = {};

  bc: Blockchain;
  ipfs: Ipfs;
  soundengine: SoundEngine;
  playlist: Playlist;
  blockconsole: BlockConsoleControl;

  constructor(props: Props) {
    super(props);

    // Create the Blockchain service
    this.bc = new Blockchain(props.auth);

    // Create the Ipfs service
    this.ipfs = new Ipfs();

    // Create the SoundEngine and initialize it
    this.soundengine = new SoundEngine({
      mediaContainer: '#audio-player',
      normalize: true
    });

    console.log('listen props', this.props);

    this.playlist = new Playlist(this.bc, this.ipfs);

    this.blockconsole = props.blockconsole;
    this.blockconsole.update("Listen.");

    this.blockconsole.on('showHide', (hidden) => {
      console.log("block console showhide inside Listen");
    })
  }


  // Component lifecycle hooks

  componentDidMount() {
    // initialize SoundEngine
    this.soundengine.init();
  }


  // Render

  getTrackBrowser(query: string) {
    return (props: any) => <TrackBrowser {...props}
      auth={this.props.auth}
      soundengine={this.soundengine}
      playlist={this.playlist}
      query={query}
    />;
  }

  getCoverBrowser(query: string) {
    return (props: any) => <CoverBrowser {...props}
      auth={this.props.auth}
      soundengine={this.soundengine}
      playlist={this.playlist}
      query={query}
    />;
  }

  render() {
    const BlockConsoleOpen = this.blockconsole.hidden;

    console.log(this.blockconsole, BlockConsoleOpen);

    return (
      <React.Fragment>
        <TopBar {...this.props} auth={this.props.auth} area="listen" />
        <div className="Listen">
          <Switch>
            <Route path="/listen/tracks" name="Tracks" render={() => (
              <TrackBrowser {...this.props}
                auth={this.props.auth}
                soundengine={this.soundengine}
                playlist={this.playlist}
                query='tracks'
              />
            )}/>
            <Route path="/listen/albums" name="Albums" component={this.getCoverBrowser('albums')}/>
            <Route path="/listen/shows" name="Shows" component={this.getCoverBrowser('shows')}/>
            <Route path="/listen/playlists" name="Playlists" component={this.getCoverBrowser('playlists')}/>
            <Route path="/listen/charts" name="Charts" component={this.getCoverBrowser('chats')}/>
            <Redirect from="/listen" to="/listen/tracks"/>
          </Switch>
          <div id="audio-player" style={{display: 'none'}} />
          <FooterPlayer auth={this.props.auth} soundengine={this.soundengine} playlist={this.playlist} />
        </div>
      </React.Fragment>
    );
  }
}
